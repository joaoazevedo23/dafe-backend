import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ComplaintsService } from './complaints.service';
import { CreateComplaintsDTO } from './dtos/create-complaints.dto';
import { UpdateComplaintsDTO } from './dtos/update-complaints.dto';

@Controller('complaints')
export class ComplaintsController {
    constructor(private readonly complaintsService: ComplaintsService) { }
    
        /* 
            GET /complaints
            GET /complaints/:id 
            POST /complaints  
            PATCH /complaints/:id
            DELETE /complaints/:id 
        */
    
        @Get() // /complaints
        findAll(@Query('topico') topico?: 'Aulas' | 'Diretores' | 'Alunos' | 'Atividades' | 'Extracurriculares') {
            return this.complaintsService.findAll(topico);
        }
    
        @Get(':id') // pegar só um
        findOne(@Param('id') id: string) {
            return this.complaintsService.findOne(id)
        }
    
        @Post() // mandar complaints
        create(@Body() post: CreateComplaintsDTO) {
            return this.complaintsService.create(post)
        }

        @Patch(':id') // atualizar complaints
        update(@Param('id') id: string, @Body() post: UpdateComplaintsDTO) {    
            return this.complaintsService.update(id, post)
        }
    
        @Delete(':id') // deletar complaints
        delete(@Param('id') id: string) {
            return this.complaintsService.delete(id)
        }

}
