/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '../mailer/mailer.service';
import { UsersService } from '../users/users.service';
import { EncryptService } from '../utils/encrypt/encrypt.service';
// Corrigindo a importação e o tipo
import { User } from '../../models/user.schema';
import { Document } from 'mongoose';

type UserDocument = User & Document;

interface JwtPayload {
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly usersService: UsersService,
    private readonly encryptService: EncryptService,
  ) {}

  async requestPasswordReset(email: string): Promise<void> {
    const user: UserDocument = await this.usersService.findbyEmail(email);

    if (!user) {
      console.log(`Tentativa de redefinição para e-mail não cadastrado: ${email}`);
      return;
    }

    const payload: JwtPayload = { email: user.email };
    const token = this.jwtService.sign(payload);

    const resetUrl = `http://localhost:3000/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Redefinição de Senha - DAFE',
      html: `
        <h2>Redefinição de Senha</h2>
        <p>Olá, ${user.nome}!</p>
        <p>Clique no link abaixo para criar uma nova senha:</p>
        <a href="${resetUrl}" target="_blank">Redefinir Senha</a>
        <p>Este link é válido por 15 minutos.</p>
      `,
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const payload = this.jwtService.verify<JwtPayload>(token);
      const user = await this.usersService.findbyEmail(payload.email);

      if (!user) {
        throw new NotFoundException('Usuário não encontrado.');
      }

      const hashedPassword = await this.encryptService.encrypt(newPassword);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      await this.usersService.update(user._id.toString(), {
        senha: hashedPassword,
      });
    } catch {
      throw new Error('Token inválido ou expirado. Por favor, solicite a redefinição novamente.');
    }
  }
}