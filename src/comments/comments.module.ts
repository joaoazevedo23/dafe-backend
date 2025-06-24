import { forwardRef, Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Comments, CommentsSchema } from '../../models/comments.schema';
import { LoginJwtModule } from '../login-jwt/login-jwt.module';
import { Post, PostSchema } from '../../models/post.schema'; // Importando o modelo de Post
import { PostModule } from 'src/post/post.module';

// O Módulo dos comentários. Cada comentário pertence a um post e a um usuário. A funcionalidade do comentário ainda esta sendo desenvolvida e esta em fase de testes.
// Por enquanto o Service possue apenas dados mockados e o Controller endpoints vazis, sem conexão com post nem alunos.

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comments.name, schema: CommentsSchema },
      { name: Post.name, schema: PostSchema }, // Descomente se precisar referenciar posts
    ]),
    
    forwardRef(() =>PostModule), 
    LoginJwtModule, 
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
