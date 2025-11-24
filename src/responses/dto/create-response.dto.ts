import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsString, ValidateNested } from "class-validator";

class AnswerDto {
    @IsNotEmpty()
    @IsString()
    questionId: string; // Id da pergunta do Form

    @IsNotEmpty()
    summittedAnswer: any; //Resposta
}

export class CreateResponseDto {
    @IsNotEmpty()
    @IsString()
    formIdOrSlug: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type   (() => AnswerDto)
    respostas: AnswerDto[];
}