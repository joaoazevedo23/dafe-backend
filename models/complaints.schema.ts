
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import slug from 'slug';

export type ComplaintsSchema = Complaints & Document;

@Schema()

export class Complaints {
  @Prop({ required: [true, 'Adicione um Titulo'] })
  titulo: string;

  @Prop({ required: [true, 'Adicione um tópico'] })
  topico: string;

  @Prop({ required: [true, 'Adicione o conteudo da denúncia']})
  conteudo: string;

  @Prop({ unique: true }) /* Campo slug */
  slug: string;
}

export const ComplaintsSchema = SchemaFactory.createForClass(Complaints);

ComplaintsSchema.pre('save', function (next) {
  if (this.isNew || this.isModified('titulo')) {
    this.slug = slug(this.titulo, { lower: true });
  }
  next();
});

