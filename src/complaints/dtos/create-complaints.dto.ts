import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class CreateComplaintsDTO{
    @IsString()
    @IsNotEmpty()
    titulo: string;

    @IsString()
    conteudo: string;

    @IsString()
    @IsIn(['aulas', 'diretores', 'alunos', 'atividades', 'extracurriculares'])
    topico: string;
}