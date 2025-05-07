import { IsString, IsNotEmpty, IsIn, MinLength, Validate, IsNumber, Min } from 'class-validator';

export class CreateLoginDTO{

    @IsString()
    email: string;

    @IsString()
    senha: string;
}