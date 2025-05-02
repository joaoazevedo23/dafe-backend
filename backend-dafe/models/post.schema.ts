import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PostSchema = Post & Document;

@Schema()
export class Post {
  @Prop({ required: true })
  titulo: string;

  @Prop({ required: true, minlength: 20 })
  conteudo: string;

  @Prop({ required: true, minlength: 20 })
  descricao: string;

  @Prop({ default: Date.now })
  data: Date;

  @Prop({ required: true, enum: ['aulas', 'diretores', 'alunos', 'atividades', 'extracurriculares'] })
  topico: string;

  @Prop({ required: false, min: 0 })
  interacao: number;
}

export const PostSchema = SchemaFactory.createForClass(Post);