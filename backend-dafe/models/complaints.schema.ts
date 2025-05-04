
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ComplaintsSchema = Complaints & Document;

@Schema()

export class Complaints {
  @Prop({ required: [true, 'Adicione um Titulo'] })
  titulo: string;

  @Prop({ required: [true, 'Adicione um tópico'] })
  topico: string;

  @Prop({ required: [true, 'Adicione o conteudo da denúncia']})
  conteudo: string;
}

export const ComplaintsSchema = SchemaFactory.createForClass(Complaints);

