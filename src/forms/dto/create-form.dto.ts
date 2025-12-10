import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class OptionDto {
  @IsString()
  label: string;

  @IsOptional()
  @IsBoolean()
  checked?: boolean;
}

class QuestionDto {
  @IsEnum(['MÚLTIPLA_ESCOLHA', 'ESCOLHA_ÚNICA', 'DISSERTATIVA'])
  tipo: string;

  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsNotEmpty()
  enunciado: string;

  @IsOptional()
  @IsBoolean()
  obrigatoria?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OptionDto)
  opcoes?: OptionDto[];

  @IsOptional()
  resposta: string | number | null = null;
}

export class CreateFormDto {
  @IsString()
  @IsNotEmpty()
  formTitulo: string;

  @IsString()
  @IsNotEmpty()
  formDesc: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  perguntas?: QuestionDto[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  responsesCount: number = 0;
}
