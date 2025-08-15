import { Body, Controller, Delete, Get, Param, Post, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from 'src/login-jwt/jwt-auth.guard';
import { CreateCommentDTO } from './dtos/create-comment.dto';
import { UserRole } from 'models/user.schema';


interface UserPayload {
  id: string;
  nome: string;
  email: string;
  usuario: string;
  role: UserRole;
}

@UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('/post/:postId')
  findByPost(@Param('postId') postId: string) {
    return this.commentsService.findByPost(postId);
  }

  @Get('/user/:userId')
  findByUser(@Param('userId') userId: string) {
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
    return this.commentsService.delete(commentId, user);
  }
}