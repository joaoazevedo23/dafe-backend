import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateFormDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  formTitulo: string;

  @IsString()
  @IsNotEmpty()
  formDesc: string;

 
  // pode expandir isso se o front-end enviar a estrutura completa de uma vez.
}