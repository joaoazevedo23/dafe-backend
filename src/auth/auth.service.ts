import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '../mailer/mailer.service';
// import { UsersService } from '../users/users.service';

// Interface para definir a estrutura do nosso payload do JWT
interface JwtPayload {
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    // private readonly usersService: UsersService,
  ) {}

  async requestPasswordReset(email: string): Promise<void> {
    const user = { email, name: 'Usuário DAFE' }; // Placeholder para teste
    if (!user) {
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
        <p>Olá, ${user.name}!</p>
        <p>Recebemos uma solicitação para redefinir sua senha. Clique no link abaixo para criar uma nova:</p>
        <a href="${resetUrl}" target="_blank">Redefinir Senha</a>
        <p>Este link é válido por 10 minutos.</p>
        <p>Se você não fez esta solicitação, por favor, ignore este e-mail.</p>
      `,
    });
  }

  // O método agora é síncrono, pois não há operações 'await' ainda.
  // Quando você adicionar a lógica de banco de dados, pode voltar a torná-lo 'async'.
  resetPassword(token: string, newPassword: string): void {
    try {
      // Usamos a interface JwtPayload para dar um tipo seguro ao retorno do verify
      const payload = this.jwtService.verify<JwtPayload>(token);
      const userEmail = payload.email;

      // Lógica de banco de dados viria aqui. Exemplo:
      // const user = await this.usersService.findByEmail(userEmail);
      // const hashedPassword = await bcrypt.hash(newPassword, 10);
      // await this.usersService.updatePassword(user.id, hashedPassword);

      console.log(`Senha do usuário ${userEmail} seria redefinida para: ${newPassword}`);
    } catch {
      // O erro é ignorado de propósito (regra no-unused-vars)
      throw new Error('Token inválido ou expirado. Por favor, solicite a redefinição novamente.');
    }
  }
}