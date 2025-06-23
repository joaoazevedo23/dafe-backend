// src/posts/post.module.ts

import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Post, PostSchema } from './../../models/post.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { LoginJwtModule } from 'src/login-jwt/login-jwt.module'; // 👈 [1] IMPORTE O MÓDULO DE AUTENTICAÇÃO

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    LoginJwtModule,
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}