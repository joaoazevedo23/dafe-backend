import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { User, UserSchema, UserRole } from 'models/user.schema'; 
import { EncryptService } from 'src/utils/encrypt/encrypt.service';
import { RefreshToken, RefreshTokenSchema } from 'models/refreshToken.schema';
import * as crypto from 'crypto';

@Injectable()
export class LoginJwtService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly encryptService: EncryptService,
        @InjectModel(User.name) private readonly usersSchema: Model<UserSchema>,
        @InjectModel(RefreshToken.name)
        private readonly refreshTokenSchema: Model<RefreshTokenSchema>
    ) {}

    async login(email: string, senha: string, lembrar: boolean): Promise<{ token: string; refreshToken: string }> {
        const user = await this.usersSchema
            .findOne({ email })
            .select('+studentDetails +professorDetails +senha')
            .lean() 
            .exec();
        
        if (!user) {
            throw new UnauthorizedException('Email não encontrado');
        }

        const senhaValidate = await this.encryptService.comparePasswords(senha, user.senha);
        if (!senhaValidate) {
            throw new UnauthorizedException('Senha incorreta');
        }

        const payload: { [key: string]: any } = { // Criação do payload do JWT
            id: user._id, 
            email: user.email,
            nome: user.nome,
            usuario: user.usuario,
            instituicao: user.instituicao,
            role: user.role,
            imageUrl: user.imageUrl,
        };

        if (user.role === UserRole.STUDENT && user.studentDetails) {
            payload.curso = user.studentDetails.curso;
            payload.modulo = user.studentDetails.modulo;
        }

        if (user.role === UserRole.PROFESSOR && user.professorDetails) {
            payload.periodo = user.professorDetails.periodo;
            payload.matricula = user.professorDetails.matricula;
        }

        const token = this.jwtService.sign(payload, { expiresIn: '3h' });

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

        const user = await this.usersSchema
            .findById(foundToken.userId)
            .select('+studentDetails +professorDetails')
            .lean() 
            .exec();
            
        if (!user) {
            throw new UnauthorizedException('Usuário associado ao refresh token não encontrado.');
        }

        const payload: { [key: string]: any } = {
            id: user._id,
            email: user.email,
            nome: user.nome,
            usuario: user.usuario,
            instituicao: user.instituicao,
            role: user.role,
            imageUrl: user.imageUrl,
        };

        if (user.role === UserRole.STUDENT && user.studentDetails) {
            payload.curso = user.studentDetails.curso;
            payload.modulo = user.studentDetails.modulo;
        }

        if (user.role === UserRole.PROFESSOR && user.professorDetails) {
            payload.periodo = user.professorDetails.periodo;
            payload.matricula = user.professorDetails.matricula;
        }

        const newToken = this.jwtService.sign(payload, { expiresIn: '1h' });
        
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