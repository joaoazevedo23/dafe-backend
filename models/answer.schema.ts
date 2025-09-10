import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MongooseSchema, Types, Document } from 'mongoose';
import { Forms } from "./forms.schema";
import { User } from "./user.schema";

export type RespostasDocument = Respostas & Document;

@Schema({ _id: false })
export class Resposta {
  @Prop({ required: true })
  perguntaId: string;

  @Prop({ required: true, type: MongooseSchema.Types.Mixed })
  resposta: any;
}
export const RespostaSchema = SchemaFactory.createForClass(Resposta);

@Schema({ timestamps: true })
export class Respostas {
  _id: Types.ObjectId;
  
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Forms', required: true })
  formulario: Forms | MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  autor: User | MongooseSchema.Types.ObjectId;
  
  @Prop({ type: [RespostaSchema] })
  respostas: Resposta[];
}
export const RespostasSchema = SchemaFactory.createForClass(Respostas);