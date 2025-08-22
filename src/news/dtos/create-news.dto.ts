import { IsString, IsNotEmpty, MinLength,} from 'class-validator';

export class CreateNewsDTO{

    @IsString()
    @IsNotEmpty()
    titulo: string;

    @IsString()
    @MinLength(5)
    conteudo: string;

    @IsString()
    @MinLength(5)
    descricao: string;
}