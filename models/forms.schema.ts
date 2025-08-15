import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MongooseSchema, Types } from 'mongoose'; 
import { User } from "./user.schema";

export type FormsSchema = Forms & Document;

@Schema()
export class Forms {
 
} 

export const FormsSchema = SchemaFactory.createForClass(Forms);