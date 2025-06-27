import { Body, Req, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, UnauthorizedException } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDTO } from './dtos/create-post.dto';
import { UpdatePostDTO } from './dtos/update-post.dto';
import { JwtAuthGuard } from 'src/login-jwt/jwt-auth.guard';
import { Request } from 'express';

interface UserPayload {
  id: string;
  nome: string;
  email: string;
}

@UseGuards(JwtAuthGuard)
@Controller('posts') //rota /posts
export class PostController {
  constructor(private readonly postService: PostService) { }

  /* 
      GET /posts -- get para puxar todos os posts (do fórum)
      GET /posts/:id -- get para puxar um post selecionado (do fórum)
      POST /posts -- post para lançar novos 
      PATCH /posts/:id -- patch para editar um post selecionado (do fórum)
      PATCH /posts/:id/interacao -- patch para adicionar interações (curtidas, comentários, etc.) em um post selecionado
      DELETE /posts/:id -- delete para deletar um post selecionado (do fórum)
  */

  @Get() // /posts ou /posts?topico=alunos
  findAll(
    @Query('topico') topico?: 'aulas' | 'diretores' | 'alunos' | 'atividades' | 'extracurriculares',
    @Query('autor') autor?: string
  ) {
    return this.postService.findAll(topico, autor);
  }

  @Get(':id') // pegar só um
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id)
  }

  @Post() // mandar postagens
  create(@Body() postDto: CreatePostDTO, @Req() req: Request) {
    const user = req.user as UserPayload; // Pegamos o usuário do token
    return this.postService.create(postDto, user.id);
  }

  @Patch(':id') // editar postagens
  update(@Param('id') id: string, @Body() postDto: UpdatePostDTO, @Req() req: Request,)
 {
    const user = req.user as UserPayload;
    return this.postService.update(id, postDto, user.id); // Para verificar permissão
  }

  @Patch(':id/interacao')
  async addInteracao(@Param('id') postId: string, @Req() req: any) {
    const userId = req.user.id
    return this.postService.addInteracao(postId, userId);
  }

  @Delete(':id') // deletar postagens
  delete(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as UserPayload;
    return this.postService.delete(id, user.id); // Para verificar permissão
  }
}
