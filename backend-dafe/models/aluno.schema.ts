import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AlunoSchema = Aluno & Document;

@Schema()
export class Aluno {
  @Prop({ required: [true, 'Adicione um nome'] })
  nome: string;

  @Prop({ required: [true, 'Adicione uma senha'] })
  senha: string;

  @Prop({ required: [true, 'Adicione um email'] })
  email: string;

  @Prop({ required: [true, 'Adicione um usuário'] })
  usuario: string;

  @Prop({ required: [true, 'Adicione um curso'] })
  curso: string;

  @Prop({ required: [true, 'Adicione um módulo'] })
  modulo: number;

  @Prop({ type: Types.ObjectId, required: [true, 'Adicione um identificador'] })
  id_usu: Types.ObjectId;
}

export const AlunoSchema = SchemaFactory.createForClass(Aluno);
