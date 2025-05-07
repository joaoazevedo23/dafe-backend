import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';


// O Módulo dos comentários. Cada comentário pertence a um post e a um usuário. A funcionalidade do comentário ainda esta sendo desenvolvida e esta em fase de testes.
// Por enquanto o Service possue apenas dados mockados e o Controller endpoints vazis, sem conexão com post nem alunos.

@Module({
  controllers: [CommentsController],
  providers: [CommentsService]
})
export class CommentsModule {}
