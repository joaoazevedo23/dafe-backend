import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from 'models/user.schema'; // Importando UserRole
import { EncryptService } from 'src/utils/encrypt/encrypt.service';
import { RefreshToken, RefreshTokenSchema } from 'models/refreshToken.schema';
import * as crypto from 'crypto';

@Injectable()
export class LoginJwtService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly encryptService: EncryptService,
    @InjectModel(User.name) private readonly usersSchema: Model<UserDocument>,
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenSchema: Model<RefreshTokenSchema>,
  ) {}

  async login(email: string, senha: string, lembrar: boolean): Promise<{ token: string; refreshToken: string }> {
    const user = await this.usersSchema.findOne({ email }).exec();
    if (!user) {
      throw new UnauthorizedException('Email não encontrado');
    }

    const senhaValidate = await this.encryptService.comparePasswords(senha, user.senha);
    if (!senhaValidate) {
      throw new UnauthorizedException('Senha incorreta');
    }

    // Correção: Montando o payload condicionalmente
    const payload: { [key: string]: any } = {
      id: user._id,
      email: user.email,
      nome: user.nome,
      usuario: user.usuario,
      role: user.role, // ✨ Melhoria: Incluir a role é essencial para autorização
    };

    // Adiciona os detalhes do estudante apenas se o usuário tiver essa role
    if (user.role === UserRole.STUDENT && user.studentDetails) {
      payload.instituicao = user.studentDetails.instituicao;
      payload.curso = user.studentDetails.curso;
      payload.modulo = user.studentDetails.modulo;
    }

    const token = this.jwtService.sign(payload, { expiresIn: '1h' });

    // O restante do método permanece o mesmo...
    const refreshTokenValue = crypto.randomBytes(64).toString('hex');
    const refreshTokenExpiresInMs = lembrar ? 30 * 24 * 60 * 60 * 1000 : 1 * 24 * 60 * 60 * 1000;
    const refreshTokenExpiresAt = new Date(Date.now() + refreshTokenExpiresInMs);

    const newRefreshToken = new this.refreshTokenSchema({
      longToken: refreshTokenValue,
      userId: user._id,
      expiresAt: refreshTokenExpiresAt,
      revoked: false,
    });
    await newRefreshToken.save();
    return { token, refreshToken: refreshTokenValue };
  }

  async refreshTokens(oldRefreshToken: string): Promise<{ token: string; refreshToken: string }> {
    const foundToken = await this.refreshTokenSchema.findOne({ longToken: oldRefreshToken, revoked: false }).exec();
    if (!foundToken || foundToken.expiresAt < new Date()) {
      if (foundToken && foundToken.expiresAt < new Date() && !foundToken.revoked) {
        foundToken.revoked = true;
        await foundToken.save();
      }
      throw new UnauthorizedException('Refresh token inválido ou expirado. Por favor, faça login novamente.');
    }

    foundToken.revoked = true;
    await foundToken.save();

    const user = await this.usersSchema.findById(foundToken.userId).exec();
    if (!user) {
      throw new UnauthorizedException('Usuário associado ao refresh token não encontrado.');
    }

    // ✅ Correção: Montando o payload condicionalmente (mesma lógica do login)
    const payload: { [key: string]: any } = {
      id: user._id,
      email: user.email,
      nome: user.nome,
      usuario: user.usuario,
      role: user.role,
    };

    if (user.role === UserRole.STUDENT && user.studentDetails) {
      payload.instituicao = user.studentDetails.instituicao;
      payload.curso = user.studentDetails.curso;
      payload.modulo = user.studentDetails.modulo;
    }

    const newToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    
    // O restante do método permanece o mesmo...
    const newRefreshTokenValue = crypto.randomBytes(64).toString('hex');
    const newRefreshTokenExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const brandNewRefreshToken = new this.refreshTokenSchema({
      longToken: newRefreshTokenValue,
      userId: user._id,
      expiresAt: newRefreshTokenExpiresAt,
      revoked: false,
    });
    await brandNewRefreshToken.save();

    return { token: newToken, refreshToken: newRefreshTokenValue };
  }

  async logout(refreshToken: string): Promise<void> {
    // Nenhuma alteração necessária aqui
    const result = await this.refreshTokenSchema.findOneAndUpdate(
      { longToken: refreshToken, revoked: false },
      { $set: { revoked: true } },
      { new: true },
    ).exec();

    if (!result) {
      console.warn('Logout: Refresh token não encontrado ou já revogado.');
    }
  }
}