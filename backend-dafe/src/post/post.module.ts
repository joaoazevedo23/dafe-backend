import { Module } from '@nestjs/common';
import { PostsController } from './post.controller';
import { PostService } from './post.service';

@Module({
  controllers: [PostsController],
  providers: [PostService],
})
export class PostModule {}