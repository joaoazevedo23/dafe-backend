import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/models/user.schema';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Extrai as roles permitidas com @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Permite o acesso
    if (!requiredRoles) {
      return true;
    }

    // Identifica o usuário logado na requisição
    const { user } = context.switchToHttp().getRequest();
    
    if (!user || !user.role) {
      throw new ForbiddenException('Você não tem permissão para acessar este recurso');
    }

    // Compara a role do usuário com as roles permitidas na rota.
    const hasPermission = requiredRoles.some((role) => user.role === role);

    if (hasPermission) {
      return true; 
    } else {
      // Se o usuário não tiver a role necessária
      throw new ForbiddenException('Você não tem permissão para acessar este recurso');
    }
  }
}