import { IsEnum, IsIn, IsInt, IsNotEmpty } from 'class-validator';

const cursosValidos = [
  'Desenvolvimento de Sistemas',
  'Administração',
  'Logística',
  'Marketing',
  'Gestão de Recursos Humanos',
];
const modulosValidos = [1, 2, 3];

export class StudentDetailsDto {

  @IsEnum(cursosValidos, { message: 'O curso fornecido não é válido.' })
  @IsNotEmpty({ message: 'O curso é obrigatório.' })
  curso: string;

  @IsNotEmpty({ message: 'O módulo é obrigatório.' })
  @IsInt({ message: 'O módulo deve ser um número inteiro.' })
  @IsIn(modulosValidos, { message: 'O módulo deve ser 1º, 2º ou 3º ano.' })
  modulo: number;
}