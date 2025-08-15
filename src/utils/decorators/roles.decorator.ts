import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'models/user.schema'; // Importe seu enum de UserRole

export const ROLES_KEY = 'roles';

// O decorator @Roles(...roles) vai anexar os papéis permitidos aos metadados da rota
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);