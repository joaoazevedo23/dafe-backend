import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type StudentSchema = Student & Document;

@Schema()
export class Student {
  @Prop({ required: [true, 'Adicione um nome'] })
  nome: string;

  @Prop({ required: [true, 'Adicione uma senha'] })
  senha: string;

  @Prop({ required: [true, 'Adicione um email'] })
  email: string;

  @Prop({ required: [true, 'Adicione um usuário'] })
  usuario: string;

  @Prop({ required: true, enum: ['DS', 'ADM', 'LOG'] })
  curso: string;

  @Prop({ required: true, enum: [1, 2, 3] })
  modulo: number;

}

export const StudentSchema = SchemaFactory.createForClass(Student);
