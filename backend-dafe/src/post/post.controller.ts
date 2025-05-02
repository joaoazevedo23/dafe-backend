import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { PostService } from './post.service';

@Controller('posts') //rota /posts
export class PostController {
    constructor(private readonly postService: PostService) { }

    /* 
        GET /posts -- get para puxar todos os posts (do fórum)
        GET /posts/:id -- get para puxar um post selecionado (do fórum)
        POST /posts -- post para lançar novos 
        DELETE /posts/:id -- delete para deletar um post selecionado (do fórum)
    */

    @Get() // /posts ou /posts?topico=alunos
    findAll(@Query('topico') topico?: 'aulas' | 'diretores' | 'alunos' | 'atividades' | 'extracurriculares') {
        return this.postService.findAll(topico);
    }


    @Get(':id') // pegar só um
    findOne(@Param('id') id: string) {
        return this.postService.findOne(id)
    }

    @Post() // mandar postagens
    create(@Body() post: any) {
        
        return this.postService.create(post)
    }

    @Delete(':id') // mandar postagens
    delete(@Param('id') id: string) {
        return this.postService.delete(id)
    }

}