import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserRole } from '../../../models/user.schema'; 

// Extrair o 'role' do usuário logado (req.user.role)
export const GetUserRole = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserRole => {
    const request = ctx.switchToHttp().getRequest(); // Contexto HTTP
    return request.user.role as UserRole; 
  },
);