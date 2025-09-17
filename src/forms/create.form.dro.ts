import { IsString, IsNotEmpty, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class OptionDto {
    @IsString()
    @IsNotEmpty()
    label: string;
}

class QuestionDto {
    @IsString()
    @IsNotEmpty()
    tipo: string;

    @IsString()
    @IsNotEmpty()
    titulo: string;

    @IsString()
    @IsNotEmpty()
    enunciado: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OptionDto)
    @IsOptional()
    opcoes?: OptionDto[];
}

export class CreateFormDto {
    @IsString()
    @IsNotEmpty()
    formTitulo: string;

    @IsString()
    @IsNotEmpty()
    formDesc: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => QuestionDto)
    @IsOptional()
    perguntas?: QuestionDto[];
}
