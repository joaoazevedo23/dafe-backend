import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.schema';
import { Form } from './forms.schema';

export type ResponseDocument = Response & Document;

@Schema({_id: false})
export class Answer {

  @Prop({ required: true }) // Identificador da pergunta original
  questionId: string;
  @Prop({ type: MongooseSchema.Types.Mixed, required: true }) // Resposta que pode ser de vários tipos
  submittedAnswer: any;
}

@Schema({ timestamps: true })
export class Response {
  @Prop({ type: Types.ObjectId, ref: Form.name, required: true })
  form: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  autor: Types.ObjectId; 
  @Prop({ type: [Answer], required: true })
  respostas: Answer[];
  createdAt: Date; 
  updatedAt: Date;
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);
export const ResponseSchema = SchemaFactory.createForClass(Response);