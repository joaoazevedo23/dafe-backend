import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Types, Document } from 'mongoose';
import { User } from './user.schema';
import slugify from 'slugify';


export type NewsSchema = News & Document;

@Schema()
export class News extends Document {
  declare _id: Types.ObjectId;
  @Prop({ required: true })
  titulo: string;

  @Prop({ required: true, minlength: 5 })
  conteudo: string;

  @Prop({ required: true, minlength: 5 })
  descricao: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  autor: User | MongooseSchema.Types.ObjectId;

  @Prop({
    required: false, // Opcional: Se não preenchido, a notícia é geral
    enum: ['Desenvolvimento de Sistemas', 'Administração', 'Logística', 'Marketing', 'Gestão de Recursos Humanos'],
  })
  cursoDestino?: string;

  @Prop({
    required: false,
    enum: [1, 2, 3]
  })
  moduloDestino?: number;

  @Prop({ unique: true }) /* Campo slugify */
  slugify: string;

  @Prop({ required: false })
  imageUrl?: string; // URL da imagem do Cloudinary

  @Prop({ required: false })
  imageHash?: string;
}

export const NewsSchema = SchemaFactory.createForClass(News);

NewsSchema.pre('save', function (next) {
  if (this.isNew || this.isModified('titulo')) {
    this.slugify = slugify(this.titulo, { lower: true });
  }
  next();
});

