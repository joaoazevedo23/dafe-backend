// professor-details.dto.ts

import { IsEnum, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

const periodo = [
  'Matutino',
  'Vespertino',
  'Noturno',
];

export class ProfessorDetailsDto {

  @IsEnum(periodo, { message: 'O periodo fornecido não é válido.' })
  @IsNotEmpty({ message: 'O periodo é obrigatório.' })
  periodo: string;

  @IsNotEmpty({ message: 'A matrícula é obrigatória.' })
  @IsNumber({}, { message: 'A matrícula deve ser um número.' })
  @Min(10000, { message: 'A matrícula deve ter 5 dígitos (mínimo 10000).' })
  @Max(99999, { message: 'A matrícula deve ter 5 dígitos (máximo 99999).' })
  matricula: number;
}