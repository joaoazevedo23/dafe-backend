
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import slugify from 'slugify';


export type ComplaintsSchema = Complaints & Document;

@Schema()

export class Complaints {
  @Prop({ required: [true, 'Adicione um Titulo'] })
  titulo: string;

  @Prop({ required: [true, 'Adicione um tópico'] })
  topico: string;

  @Prop({ required: [true, 'Adicione o conteudo da denúncia']})
  conteudo: string;

  @Prop({ unique: true }) /* slug */
  slugify: string;

  @Prop({ /* Campo de destino */
    type: String,
    enum: ['professor', 'manager', 'admin'],
    required: true,
  })
  destinoRole: string;
}

export const ComplaintsSchema = SchemaFactory.createForClass(Complaints);

ComplaintsSchema.pre('save', function (next) {
  if (this.isNew || this.isModified('titulo')) {
    this.slugify = slugify(this.titulo, { lower: true });
  }
  next();
});

