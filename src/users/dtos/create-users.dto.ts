import {IsDefined, IsEmail, IsEnum, IsNotEmpty, IsString, ValidateIf, ValidateNested} from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole } from '../../../models/user.schema';
import { StudentDetailsDto } from './student-details.dto';
import { ProfessorDetailsDto } from './professor-details.dto';
  
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

    @IsString({ message: 'A instituição deve ser um texto' })
    @IsNotEmpty({ message: 'A instituição é obrigatória' })
    instituicao: string;
  
    @IsEnum(UserRole, { message: 'O tipo de usuário (role) não é válido' })
    @IsNotEmpty({ message: 'O tipo de usuário (role) é obrigatório' })
    role: UserRole;
  
    // Validação para o objeto aninhado studentDetails
    @ValidateIf((o) => o.role === UserRole.STUDENT) 
    @IsDefined({ message: 'Os detalhes do estudante são obrigatórios para este tipo de usuário' })
    @ValidateNested({ message: 'Os detalhes do estudante contêm dados inválidos' }) 
    @Type(() => StudentDetailsDto) 
    studentDetails?: StudentDetailsDto;

    // Validação para o objeto aninhado professorDetails
    @ValidateIf((o) => o.role === UserRole.PROFESSOR) 
    @IsDefined({ message: 'Os detalhes do professor são obrigatórios para este tipo de usuário' })
    @ValidateNested({ message: 'Os detalhes do professor contêm dados inválidos' }) 
    @Type(() => ProfessorDetailsDto) 
    professorDetails?: ProfessorDetailsDto;
  }