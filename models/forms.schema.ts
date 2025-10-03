import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { User } from 'models/user.schema'; 

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
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: User.name })
  autor: MongooseSchema.Types.ObjectId; // Campo 'autor' adicionado com referência ao User

  @Prop({ required: true })
  formTitulo: string;

  @Prop({ required: true })
  formDesc: string;

  @Prop({ type: [Question], default: [] })
  perguntas: Question[];

  @Prop({ unique: true, default: () => uuidv4() })
  slug: string;
}

export const FormSchema = SchemaFactory.createForClass(Form);