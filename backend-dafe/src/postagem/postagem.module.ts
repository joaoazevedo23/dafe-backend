import { Module } from '@nestjs/common';
import { PostagemController } from './postagem.controller';
import { PostagemService } from './postagem.service';

@Module({
  controllers: [PostagemController],
  providers: [PostagemService]
})
export class PostagemModule {}
