import { IsString, IsNotEmpty, IsIn, MinLength, IsOptional, IsNumber, Min } from 'class-validator';
import {z} from 'zod';

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
    @IsString()
    imageUrl?: string;
}

export const CreatePostSchema = z.object({
    titulo: z.string(),
    conteudo: z.string(),
    descricao: z.string(),
    topico: z.string(),
    interacao: z.number().optional(),
    commentsCount: z.number().optional(),
    imageUrl: z.string().url().optional(),
})