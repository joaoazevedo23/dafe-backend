import { IsString, IsNotEmpty, IsIn, MinLength, IsOptional, IsNumber, Min, IsUrl } from 'class-validator';

export class CreatePostDTO{

    @IsString()
    @IsNotEmpty()
    titulo: string;

    @IsString()
    @MinLength(5)
    conteudo: string;

    @IsString()
    @MinLength(5)
    descricao: string;

    @IsString()
    @IsIn(['aulas', 'diretores', 'alunos', 'atividades', 'extracurriculares'])
    topico: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    interacao?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    commentsCount?: number;

    @IsOptional()
    @IsString() // mudança da regra "isUrl" para "isString"
    @MinLength(32)
    imageHash?: string;
}
