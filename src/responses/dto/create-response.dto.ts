import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsString, ValidateNested, IsOptional } from "class-validator";

class AnswerDto {
    @IsNotEmpty()
    @IsString()
    questionId: string;

    @IsOptional()
    submittedAnswer: any;
}

export class CreateResponseDto {
    @IsNotEmpty()
    @IsString()
    formIdOrSlug: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AnswerDto)
    respostas: AnswerDto[];
}