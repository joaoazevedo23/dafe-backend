import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MongooseSchema, Types } from 'mongoose'; 
import { User } from "./user.schema";

export type NewsSchema = News & Document;

@Schema()
export class News {
 //Aqui será inserida a estrutura das news
} 

export const NewsSchema = SchemaFactory.createForClass(News);

//titulo, descrição e conteúdo