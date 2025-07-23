import {
    IsDefined,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateIf,
    ValidateNested,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  import { UserRole } from '../../../models/user.schema';
  import { StudentDetailsDto } from './student-details.dto';
  
  export class CreateUsersDTO {
    @IsString()
    @IsNotEmpty({ message: 'O nome é obrigatório' })
    nome: string;
  
    @IsString()
    @IsNotEmpty({ message: 'A senha é obrigatória' })
    senha: string;
  
    @IsEmail({}, { message: 'Forneça um email válido' })
    @IsNotEmpty({ message: 'O email é obrigatório' })
    email: string;
  
    @IsString()
    @IsNotEmpty({ message: 'O nome de usuário é obrigatório' })
    usuario: string;
  
    @IsEnum(UserRole, { message: 'O tipo de usuário (role) não é válido' })
    @IsNotEmpty({ message: 'O tipo de usuário (role) é obrigatório' })
    role: UserRole;
  
    // Validação para o objeto aninhado studentDetails
    @ValidateIf((o) => o.role === UserRole.STUDENT) // Valida o campo a seguir SOMENTE SE a condição for verdadeira
    @IsDefined({ message: 'Os detalhes do estudante são obrigatórios para este tipo de usuário' })
    @ValidateNested({ message: 'Os detalhes do estudante contêm dados inválidos' }) // Diz ao class-validator para validar o objeto aninhado
    @Type(() => StudentDetailsDto) // Diz ao class-transformer como criar uma instância do DTO aninhado
    studentDetails?: StudentDetailsDto;
  }