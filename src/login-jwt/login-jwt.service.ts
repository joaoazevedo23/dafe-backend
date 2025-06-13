import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { Student, StudentSchema } from 'models/student.schema';
import { EncryptService } from 'src/utils/encrypt/encrypt.service';
import { RefreshToken, RefreshTokenSchema } from 'models/refreshToken.schema';
import * as crypto from 'crypto';

@Injectable()
export class LoginJwtService {

  constructor(
    private readonly jwtService: JwtService,
    private readonly encryptService: EncryptService,
    @InjectModel(Student.name) private readonly studentsSchema: Model<StudentSchema>,
    @InjectModel(RefreshToken.name) private readonly refreshTokenSchema: Model<RefreshToken>

  ) { }

  async login(email: string, senha: string, lembrar: boolean): Promise<{ token: string; refreshToken: string }> {
    const student = await this.studentsSchema.findOne({ email }).exec();
    if (!student) {
      throw new UnauthorizedException('Email não encontrado');
    }

    const senhaValidate = await this.encryptService.comparePasswords(senha, student.senha);
    if (!senhaValidate) {
      throw new UnauthorizedException('Senha incorreta');
    }

    const payload = {
      id: student._id,
      email: student.email,
      nome: student.nome,
      curso: student.curso,
      modulo: student.modulo,
      usuario: student.usuario,
      instituicao: student.instituicao
    };
    const token = this.jwtService.sign(payload, { expiresIn: '15m' });

    const refreshTokenValue = crypto.randomBytes(64).toString('hex'); // Gera um refresh token aleatório
    const refreshTokenExpiresInMs = lembrar ? 30 * 24 * 60 * 60 * 1000 : 1 * 24 * 60 * 60 * 1000; // 30 dias ou 1 dia
    const refreshTokenExpiresAt = new Date(Date.now() + refreshTokenExpiresInMs);

    const newRefreshToken = new this.refreshTokenSchema({
      longToken: refreshTokenValue,
      userId: student._id,
      expiresAt: refreshTokenExpiresAt,
      revoked: false,
    });
    await newRefreshToken.save();
    return { token, refreshToken: refreshTokenValue };
  }

  async refreshTokens(oldRefreshToken: string): Promise<{ token: string; refreshToken: string }> {
    const foundToken = await this.refreshTokenSchema.findOne({ longToken: oldRefreshToken, revoked: false }).exec();

    if (!foundToken || foundToken.expiresAt < new Date()) {
      // Se for encontrado e expirado, revogar (limpeza e segurança)
      if (foundToken && foundToken.expiresAt < new Date() && !foundToken.revoked) {
        foundToken.revoked = true;
        await foundToken.save();
      }
      throw new UnauthorizedException('Refresh token inválido ou expirado. Por favor, faça login novamente.');
    }

    // ROTAÇÃO DE REFRESH TOKEN: Revoga o token antigo imediatamente
    foundToken.revoked = true;
    await foundToken.save();

    // Encontra o usuário para construir o payload do novo access token
    const student = await this.studentsSchema.findById(foundToken.userId).exec();
    if (!student) {
      throw new UnauthorizedException('Usuário associado ao refresh token não encontrado.');
    }

    const payload = {
      id: student._id,
      email: student.email,
      nome: student.nome,
      curso: student.curso,
      modulo: student.modulo,
      usuario: student.usuario,
      instituicao: student.instituicao,
    };

    const newToken = this.jwtService.sign(payload, { expiresIn: '15m' });

    // Gera um novo refresh token
    const newRefreshTokenValue = crypto.randomBytes(64).toString('hex');
    const newRefreshTokenExpiresAt = new Date(Date.now() + (30 * 24 * 60 * 60 * 1000));

    const brandNewRefreshToken = new this.refreshTokenSchema({
      longToken: newRefreshTokenValue,
      userId: student._id,
      expiresAt: newRefreshTokenExpiresAt,
      revoked: false,
    });
    await brandNewRefreshToken.save();

    return { token: newToken, refreshToken: newRefreshTokenValue };
  }

  async logout(refreshToken: string): Promise<void> {
    const result = await this.refreshTokenSchema.findOneAndUpdate(
      { token: refreshToken, revoked: false },
      { $set: { revoked: true } },
      { new: true }
    ).exec();

    if (!result) {
      console.warn('Logout: Refresh token não encontrado ou já revogado.');
    }
  }
}
