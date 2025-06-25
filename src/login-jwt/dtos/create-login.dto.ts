import { IsString, IsNotEmpty, IsIn, MinLength, Validate, IsNumber, Min, IsBoolean } from 'class-validator';

export class CreateLoginDTO{

    @IsString()
    email: string;

    @IsString()
    senha: string;

    @IsBoolean()
    lembrar: boolean;

}