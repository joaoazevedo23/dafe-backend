import { Body, Controller, Delete, Get, Param, Post, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from 'src/login-jwt/jwt-auth.guard';
import { CreateCommentDTO } from './dtos/create-comment.dto';
import { UserRole } from 'models/user.schema';


// Interface atualizada para refletir o payload completo do JWT
interface UserPayload {
  id: string;
  nome: string;
  email: string;
  usuario: string;
  role: UserRole;
}

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('/post/:postId')
  findByPost(@Param('postId') postId: string) {
    return this.commentsService.findByPost(postId);
  }

  // ✅ Rota e parâmetro renomeados para refletir a entidade 'User'
  @Get('/user/:userId')
  findByUser(@Param('userId') userId: string) {
    // Assumindo que o método no serviço também será renomeado para findByUser
    return this.commentsService.findByUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/post/:postId')
  create(@Param('postId') postId: string, @Body() dto: CreateCommentDTO, @Req() req: Request) {
    const user = req.user as UserPayload;
    return this.commentsService.create(dto, user.id, postId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':commentId')
  delete(@Param('commentId') commentId: string, @Req() req: Request) {
    const user = req.user as UserPayload;
    // ✅ Passando o usuário inteiro para o serviço ter mais contexto de permissão
    return this.commentsService.delete(commentId, user);
  }
}