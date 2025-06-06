import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateCommentDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  conteudo: string;
}