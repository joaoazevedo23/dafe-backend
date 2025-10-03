import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.schema';
import { Form } from './forms.schema';

export type ResponseDocument = Response & Document;

@Schema({ timestamps: true })
export class Response {
  @Prop({ type: Types.ObjectId, ref: Form.name, required: true })
  form: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  autor: Types.ObjectId; 

  @Prop({ type: [MongooseSchema.Types.Mixed], required: true })
  responses: (number | number[] | string)[];
}

export const ResponseSchema = SchemaFactory.createForClass(Response);