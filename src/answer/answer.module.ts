import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnswersService } from './answer.service';
import { AnswersController } from './answer.controller';
import { Respostas, RespostasSchema } from '../../models/answer.schema';
import { Forms, FormsSchema } from '../../models/forms.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Respostas.name, schema: RespostasSchema },
      { name: Forms.name, schema: FormsSchema }, // Importa o model do Form para validação
    ]),
  ],
  controllers: [AnswersController],
  providers: [AnswersService],
})
export class AnswerModule {}