import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, MinLength, IsOptional, IsNumber, IsIn, IsInt} from 'class-validator';

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

    @IsOptional()
    @IsString()
    @IsIn(['Desenvolvimento de Sistemas', 'Administração', 'Logística', 'Marketing', 'Gestão de Recursos Humanos'])
    cursoDestino?: string;

    @IsOptional()
    @IsNumber()
    @IsInt()
    @Type(() => Number) // Converte string de query/body para Number
    @IsIn([1, 2, 3])
    moduloDestino?: number;

    @IsOptional()
    @IsString()
    imageUrl?: string; 
    
    @IsOptional()
    @IsString()
    imageHash?: string;
}