import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { User } from 'src/models/user.schema';
import slugify from 'slugify'; 

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
  declare _id: Types.ObjectId;

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
  autor: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  formTitulo: string;

  @Prop({ required: true })
  formDesc: string;

  @Prop({ type: [Question], default: [] })
  perguntas: Question[];

  @Prop({ unique: true })
  slug: string;

  @Prop({ required: false, min: 0, default: 0 })
  responsesCount: number;
}

export const FormSchema = SchemaFactory.createForClass(Form);

FormSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  await this.model('Response').deleteMany({ form: this._id });
  console.log(`Form com id ${this._id} deletado, removendo as respostas associadas.`);
  next();
});

FormSchema.pre('save', function (next) {
  if (this.isNew || this.isModified('formTitulo')) {
    const baseSlug = slugify(this.formTitulo, { lower: true });
    const uniqueSuffix = Date.now().toString(36);
    this.slug = `${baseSlug}-${uniqueSuffix}`;
  }
  next();
});