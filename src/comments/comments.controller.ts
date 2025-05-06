import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('comments') //rota /comments
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) { }

    @Get() // /comments/
    findAll() {
        return []
    }

    @Get('/post/:id') // pegar comentários de um post específico
    findByPost(@Param('id') id: number) {
        return []
    }

    @Get('/aluno/:aluno_id') // pegar comentários de um aluno específico
    findByAluno(@Param('aluno_id') aluno_id: string) {
        return []
    }

    @Post() // criar comentários
    create(@Body() comment: any) {
        return []
    }

    @Delete(':id') // deletar comentários
    delete(@Param('id') id: string) {
        return []
    }
}