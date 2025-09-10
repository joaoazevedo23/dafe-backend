import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MongooseSchema, Types } from 'mongoose'; 
import { User } from "./user.schema";

export type NewsSchema = News & Document;

@Schema()
export class News {
 _id: Types.ObjectId;
  @Prop({ required: true })
  titulo: string;

  @Prop({ required: true, minlength: 5 })
  conteudo: string;

  @Prop({ required: true, minlength: 5 })
  descricao: string;

  @Prop({type: MongooseSchema.Types.ObjectId, ref: 'User', required: true})
  autor: User | MongooseSchema.Types.ObjectId;
} 

export const NewsSchema = SchemaFactory.createForClass(News);

