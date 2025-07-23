import { PartialType } from '@nestjs/mapped-types';
import { CreateUsersDTO } from './create-users.dto';

// PartialType torna todos os campos do CreateUsersDTO opcionais.
// Não é preciso reescrever nenhuma lógica de validação!
export class UpdateUsersDTO extends PartialType(CreateUsersDTO) {}