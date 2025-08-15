import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

const periodo = [
  'Matutino',
  'Vespertino',
  'Noturno',
];

export class ProfessorDetailsDto {

  @IsEnum(periodo, { message: 'O periodo fornecido não é válido' })
  @IsNotEmpty({ message: 'O periodo é obrigatório' })
  periodo: string;

  @IsNumber({}, { message: 'A matricula deve ser um número' })
  @IsNotEmpty({ message: 'A matricula é obrigatória' })
  matricula: number;
}