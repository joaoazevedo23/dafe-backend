import { forwardRef, Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Comments, CommentsSchema } from '../models/comments.schema';
import { LoginJwtModule } from '../login-jwt/login-jwt.module';
import { Post, PostSchema } from '../models/post.schema';
import { PostModule } from 'src/posts/post.module';

// O Módulo dos comentários. Cada comentário pertence a um post e a um usuário.

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comments.name, schema: CommentsSchema }, { name: Post.name, schema: PostSchema }, ]),
    forwardRef(() =>PostModule), 
    LoginJwtModule, 
  ],

  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
