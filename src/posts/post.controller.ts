import { Body, Req, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, UseInterceptors, UploadedFile, HttpCode } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDTO } from './dtos/create-post.dto';
import { UpdatePostDTO } from './dtos/update-post.dto';
import { JwtAuthGuard } from 'src/login-jwt/jwt-auth.guard';
import { Request } from 'express';
import { UserRole } from 'src/models/user.schema';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';

interface UserPayload {
  id: string;
  nome: string;
  email: string;
  usuario: string;
  role: UserRole;
  instituicao: string;
  curso?: string;
  modulo?: number;
  matricula?: number;
  periodo?: string;
}

@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) { }

  @Get() // /posts ou /posts?topico=alunos
  findAll(
    @Query('topico') topico?: 'aulas' | 'diretores' | 'alunos' | 'atividades' | 'extracurriculares',
    @Query('autor') autor?: string,
  ) {
    return this.postService.findAll(topico, autor);
  }

  @Get(':idOrSlug') // pegar só um post pelo id ou slug
  findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.postService.findOne(idOrSlug);
  }

  @Post()
  @Roles(UserRole.STUDENT, UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() postDto: CreatePostDTO,
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const user = req.user as UserPayload;
    return this.postService.create(postDto, user.id, file);
  }

  @Patch(':idOrSlug') // editar post pelo id ou slug
  @UseInterceptors(FileInterceptor('image')) // Adicionado interceptor para PATCH
  update(
    @Param('idOrSlug') idOrSlug: string,
    @Body() postDto: UpdatePostDTO,
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File, // Adicionado file para o update
  ) {
    const user = req.user as UserPayload;
    // O service agora precisa receber o 'file' para lidar com o upload na atualização
    return this.postService.update(idOrSlug, postDto, user);
  }

  @Patch(':idOrSlug/interacao') // adicionar interação (curtida, etc)
  addInteracao(@Param('idOrSlug') idOrSlug: string, @Req() req: Request) {
    const user = req.user as UserPayload;
    return this.postService.addInteracao(idOrSlug, user.id);
  }

  @Delete(':idOrSlug') // deletar post pelo id ou slug
  delete(@Param('idOrSlug') idOrSlug: string, @Req() req: Request) {
    const user = req.user as UserPayload;
    return this.postService.delete(idOrSlug, user);
  }
}