import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable() // Verifica se o usuário está logado para acessar rotas protegidas.
export class JwtAuthGuard extends AuthGuard('jwt') {

    handleRequest(err, user, info) {
        if (err || !user) {
          throw err || new UnauthorizedException('Acesso não autorizado. Por favor, realize o login para continuar.');
        }
        return user;
      }
}