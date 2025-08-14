import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'models/user.schema';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Extrai as roles permitidas que anotamos com o @Roles() na rota
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Se nenhuma role for necessária na rota, permite o acesso
    if (!requiredRoles) {
      return true;
    }

    // 2. Pega o objeto 'user' da requisição.
    //    Este objeto foi adicionado pelo JwtAuthGuard, por isso ele deve rodar ANTES.
    const { user } = context.switchToHttp().getRequest();
    
    // Se não houver usuário na requisição, bloqueia o acesso
    if (!user || !user.role) {
      throw new ForbiddenException('Você não tem permissão para acessar este recurso');
    }

    // 3. Compara a role do usuário com as roles permitidas na rota.
    //    O método .some() retorna true se o usuário tiver pelo menos uma das roles necessárias.
    const hasPermission = requiredRoles.some((role) => user.role === role);

    if (hasPermission) {
      return true; // Acesso permitido!
    } else {
      // Lança uma exceção se o usuário não tiver a role necessária
      throw new ForbiddenException('Você não tem permissão para acessar este recurso');
    }
  }
}