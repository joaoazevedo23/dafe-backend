// src/forms/schemas/form.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type FormDocument = Form & Document;

@Schema()
export class Option {
  @Prop({ required: true })
  label: string;

  @Prop({ default: false })
  checked?: boolean; 
}

@Schema()
export class Question {
  @Prop({ required: true, enum: ['MÚLTIPLA_ESCOLHA', 'ESCOLHA_ÚNICA', 'DISSERTATIVA'] })
  tipo: string;

  @Prop({ required: true })
  titulo: string;

  @Prop({ required: true })
  enunciado: string;

  @Prop({ default: false })
  obrigatoria: boolean;

  @Prop({ type: [{ label: String, checked: Boolean }], required: false })
  opcoes?: Option[];

  @Prop({ type: MongooseSchema.Types.Mixed })
  resposta?: string | number | string[];
}

@Schema({ timestamps: true })
export class Form {
  @Prop({ required: true })
  formTitulo: string;

  @Prop({ required: true })
  formDesc: string;

  @Prop({ type: [Question], default: [] })
  perguntas: Question[];
}

export const FormSchema = SchemaFactory.createForClass(Form);
