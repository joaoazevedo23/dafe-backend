import {Controller, Post, Body, Query, HttpCode, HttpStatus} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body('email') email: string) {
    await this.authService.requestPasswordReset(email);
    return {
      message:
        'Se um usuário com este e-mail existir, um link de redefinição foi enviado.',
    };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Query('token') token: string,
    @Body('password') newPassword: string,
  ) {
    await this.authService.resetPassword(token, newPassword);
    return { message: 'Senha redefinida com sucesso!' };
  }
}