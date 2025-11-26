import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.schema';
import { Post } from './post.schema';

export type CommentsSchema = Comments & Document;

@Schema({ timestamps: true })
export class Comments {
  _id: Types.ObjectId;
  @Prop({ required: true })
  conteudo: string;

  @Prop({ default: Date.now })
  data: Date; 
  
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  autor: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Post', required: true })
  post: Post;

}
export const CommentsSchema = SchemaFactory.createForClass(Comments);