import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose'; 
import { User } from './user.schema';
import {Comments} from './comments.schema';

export type PostSchema = Post & Document;


@Schema()
export class Post {
  _id: Types.ObjectId;
  @Prop({ required: true })
  titulo: string;

  @Prop({ required: true, minlength: 5 })
  conteudo: string;

  @Prop({ required: true, minlength: 5 })
  descricao: string;

  @Prop({ default: Date.now })
  data: Date;

  @Prop({ required: true, enum: ['aulas', 'diretores', 'alunos', 'atividades', 'extracurriculares'] })
  topico: string;

  @Prop({ required: false, min: 0, default: 0 })
  interacao: number;
  
  @Prop({type: [{type: MongooseSchema.Types.ObjectId, ref: 'User'}], default: []})
  interactedBy: Types.ObjectId[];

  @Prop({required: false, min: 0, default: 0})
  commentsCount: number;

  @Prop({type: MongooseSchema.Types.ObjectId, ref: 'User', required: true})
  autor: User | MongooseSchema.Types.ObjectId;
} 

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.pre('deleteOne', { document:true, query: false}, async function(next){
await this.model('Comments').deleteMany({ post: this._id });
console.log(`Post com id ${this._id} deletado, removendo comentários associados.`);
next();
});