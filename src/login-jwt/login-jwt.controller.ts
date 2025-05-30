import { Body, Controller, Post } from '@nestjs/common';
import { LoginJwtService } from './login-jwt.service';
import { CreateLoginDTO } from './dto/create-login.dto';

@Controller('login-jwt')
export class LoginJwtController {
  constructor(private readonly logJwtService: LoginJwtService) {}

  @Post() // POST /login-jwt
  async login(@Body() createLoginDto: CreateLoginDTO) {
    const { email, senha, lembrar} = createLoginDto;
    return await this.logJwtService.login(email, senha, lembrar);
  }
}
