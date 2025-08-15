import { Body, Controller, Post } from '@nestjs/common';
import { LoginJwtService } from './login-jwt.service';
import { CreateLoginDTO } from './dtos/create-login.dto';

@Controller('login-jwt')
export class LoginJwtController {
  constructor(private readonly logJwtService: LoginJwtService) {}

  @Post() // POST /login-jwt
  async login(@Body() createLoginDto: CreateLoginDTO) {
    const { email, senha, lembrar} = createLoginDto;
    return await this.logJwtService.login(email, senha, lembrar);
  }

  @Post('refresh') // POST /login-jwt
  async refreshTk(@Body('refreshToken') refreshToken: string) {
    return await this.logJwtService.refreshTokens(refreshToken);
  }

  @Post('logout') // POST /login-jwt/logout
  async logout(@Body('refreshToken') refreshToken: string) {  
    await this.logJwtService.logout(refreshToken);
    return { message: 'Logout realizado com sucesso' };
  }
}
