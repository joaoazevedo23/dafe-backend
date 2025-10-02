import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Types } from 'mongoose';
import { User } from './user.schema';
import slug from 'slug';

export type NewsSchema = News & Document;

@Schema()
export class News {
  _id: Types.ObjectId;
  @Prop({ required: true })
  titulo: string;

  @Prop({ required: true, minlength: 5 })
  conteudo: string;

  @Prop({ required: true, minlength: 5 })
  descricao: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  autor: User | MongooseSchema.Types.ObjectId;

  @Prop({ unique: true }) /* Campo slug */
  slug: string;
}

export const NewsSchema = SchemaFactory.createForClass(News);

NewsSchema.pre('save', function (next) {
  if (this.isNew || this.isModified('titulo')) {
    this.slug = slug(this.titulo, { lower: true });
  }
  next();
});

