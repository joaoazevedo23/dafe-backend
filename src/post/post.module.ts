import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Post, PostSchema } from './../../models/post.schema';
import { MongooseModule } from '@nestjs/mongoose';


// Único módulo funcional protegido pelo JWT.
// Possui os métodos de criar, atualizar e deletar posts.
@Module({
  imports: [MongooseModule.forFeature([{ name: Post.name, schema: PostSchema}])],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}