import { IsString, IsNotEmpty, IsIn, MinLength, Validate, IsNumber, Min } from 'class-validator';
import { Match } from 'src/utils/match.decorator';

export class CreateStudentsDTO{

    @IsString()
    @IsNotEmpty()
    nome: string;

    @IsString()
    @MinLength(5)
    senha: string;

    @IsString()
    @Validate(Match, ['senha'], {
        message: 'As senhas não batem :('
    })
    confirmarSenha: string;

    @IsString()
    email: string;


    @IsString()
    usuario: string;

    @IsString()
    instituicao: string;

    @IsString()
    @IsIn(['Desenvolvimento de Sistemas','Administração','Logística', 'Marketing', 'Gestão de Recursos Humanos'])
    curso: string;

    @IsNumber()
    @Min(1)
    @IsIn([1, 2, 3])
    modulo: number;
}