import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ComplaintsService } from './complaints.service';

@Controller('complaints')
export class ComplaintsController {
    constructor(private readonly complaintsService: ComplaintsService) { }
    
        /* 
            GET /complaints
            GET /complaints/:id 
            POST /complaints  
            DELETE /complaints/:id 
        */
    
        @Get() // /complaints
        findAll(@Query('topico') topico?: 'aulas' | 'diretores' | 'alunos' | 'atividades' | 'extracurriculares') {
            return this.complaintsService.findAll(topico);
        }
    
    
        @Get(':id') // pegar só um
        findOne(@Param('id') id: string) {
            return this.complaintsService.findOne(id)
        }
    
        @Post() // mandar complaints
        create(@Body() post: any) {
            
            return this.complaintsService.create(post)
        }
    
        @Delete(':id') // deletar complaints
        delete(@Param('id') id: string) {
            return this.complaintsService.delete(id)
        }

}
