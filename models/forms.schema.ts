import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MongooseSchema, Types } from 'mongoose'; 
import { User } from "./user.schema";

export type FormsSchema = Forms & Document;

@Schema()
export class Forms {
 //Aqui será inserida a estrutura do formulário
} 

export const FormsSchema = SchemaFactory.createForClass(Forms);