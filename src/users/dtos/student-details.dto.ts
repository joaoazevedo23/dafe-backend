import { IsEnum, IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';

// Enumerações para validação, podem ser importadas ou redefinidas aqui
const cursosValidos = [
  'Desenvolvimento de Sistemas',
  'Administração',
  'Logística',
  'Marketing',
  'Gestão de Recursos Humanos',
];
const modulosValidos = [1, 2, 3];

export class StudentDetailsDto {
  @IsString({ message: 'A instituição deve ser um texto' })
  @IsNotEmpty({ message: 'A instituição é obrigatória' })
  instituicao: string;

  @IsEnum(cursosValidos, { message: 'O curso fornecido não é válido' })
  @IsNotEmpty({ message: 'O curso é obrigatório' })
  curso: string;

  @IsIn(modulosValidos, { message: 'O módulo deve ser 1, 2 ou 3' })
  @IsNumber({}, { message: 'O módulo deve ser um número' })
  @IsNotEmpty({ message: 'O módulo é obrigatório' })
  modulo: number;
}