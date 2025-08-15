import { Body, Req, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDTO } from './dtos/create-post.dto';
import { UpdatePostDTO } from './dtos/update-post.dto';
import { JwtAuthGuard } from 'src/login-jwt/jwt-auth.guard';
import { Request } from 'express';
import { UserRole } from 'models/user.schema';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { RolesGuard } from 'src/utils/guards/roles.guard';

interface UserPayload {
  id: string;
  nome: string;
  email: string;
  usuario: string;
  role: UserRole; 
  instituicao: string;

  // Campos adicionais para a role student
  curso?: string;
  modulo?: number;
}

@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  /* GET /posts -- get para puxar todos os posts (do fórum)
      GET /posts/:id -- get para puxar um post selecionado (do fórum)
      POST /posts -- post para lançar novos 
      PATCH /posts/:id -- patch para editar um post selecionado (do fórum)
      PATCH /posts/:id/interacao -- patch para adicionar interações (curtidas, comentários, etc.) em um post selecionado
      DELETE /posts/:id -- delete para deletar um post selecionado (do fórum)
  */

  @Get() // /posts ou /posts?topico=alunos
  findAll(
    @Query('topico') topico?: 'aulas' | 'diretores' | 'alunos' | 'atividades' | 'extracurriculares',
    @Query('autor') autor?: string,
  ) {
    return this.postService.findAll(topico, autor);
  }

  @Get(':id') // pegar só um
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Post() // mandar postagens
  @Roles(UserRole.STUDENT) // Apenas  estudantes podem acessar
  @UseGuards(JwtAuthGuard, RolesGuard) // Primeiro checa o login, depois a permissão
  create(@Body() postDto: CreatePostDTO, @Req() req: Request) {
    const user = req.user as UserPayload; // Pegamos o usuário do token
    return this.postService.create(postDto, user.id);
  }

  @Patch(':id') // editar postagens
  update(@Param('id') id: string, @Body() postDto: UpdatePostDTO, @Req() req: Request) {
    const user = req.user as UserPayload;
    // Passa o usuário inteiro para o serviço ter mais contexto de permissão
    return this.postService.update(id, postDto, user);
  }

  @Patch(':id/interacao')
  addInteracao(@Param('id') postId: string, @Req() req: Request) {
    const user = req.user as UserPayload;
    return this.postService.addInteracao(postId, user.id);
  }

  @Delete(':id') // deletar postagens
  delete(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as UserPayload;
    // Passa o usuário inteiro para o serviço ter mais contexto de permissão
    return this.postService.delete(id, user);
  }
}