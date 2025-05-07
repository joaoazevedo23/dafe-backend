import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable() // Verifica se o usuário está logado para acessar rotas protegidas.
export class JwtAuthGuard extends AuthGuard('jwt') {}