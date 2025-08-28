import { IsMongoId, IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// DTO answer individual
class RespostaDto {
    @IsNotEmpty()
    perguntaId: string;
  
    @IsNotEmpty()
    resposta: any;
}

export class CreateAnswerDto {
  @IsMongoId()
  @IsNotEmpty()
  formulario: string; // ID do formulário

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RespostaDto)
  respostas: RespostaDto[];
}