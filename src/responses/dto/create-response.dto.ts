import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";

class AnswerDto {
    @IsNotEmpty()
    @IsString()
    questionId: string;

    @IsOptional()
    submittedAnswer: string | number | string[] | number[] | null;
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
