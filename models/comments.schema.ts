import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CommentsSchema = Comments & Document;

@Schema()
export class Comments {
  @Prop({ required: true })
  conteudo: string;

  @Prop({ default: Date.now })
  data: Date; 
}
export const CommentsSchema = SchemaFactory.createForClass(Comments);