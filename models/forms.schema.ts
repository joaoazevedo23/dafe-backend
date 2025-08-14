import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MongooseSchema, Types } from 'mongoose'; 
import { User } from "./user.schema";

export type FormsSchema = Forms & Document;

@Schema()
export class Forms {
  _id: Types.ObjectId;
  @Prop({ required: true })
  titulo: string;

  @Prop({ required: true, minlength: 5 })
  conteudo: string;
} 

export const FormsSchema = SchemaFactory.createForClass(Forms);