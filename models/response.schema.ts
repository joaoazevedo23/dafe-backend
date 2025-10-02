// src/models/response.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type ResponseDocument = Response & Document;

@Schema({ timestamps: true })
export class Response {
  @Prop({ type: Types.ObjectId, ref: 'Form', required: true })
  form: Types.ObjectId;

  @Prop({ required: true })
  usuario: string;

  @Prop({ type: [MongooseSchema.Types.Mixed], required: true }) 
  respostas: (number | number[] | string)[];
}

export const ResponseSchema = SchemaFactory.createForClass(Response);
