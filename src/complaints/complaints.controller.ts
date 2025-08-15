import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ComplaintsService } from './complaints.service';
import { CreateComplaintsDTO } from './dtos/create-complaints.dto';
import { UpdateComplaintsDTO } from './dtos/update-complaints.dto';
import { JwtAuthGuard } from 'src/login-jwt/jwt-auth.guard';


@UseGuards(JwtAuthGuard)
@Controller('complaints')
export class ComplaintsController {
  constructor(private readonly complaintsService: ComplaintsService) {}

  /* GET /complaints      -> Público
      GET /complaints/:id    -> Público
      POST /complaints       -> Público
      PATCH /complaints/:id  -> Público (Atenção com a segurança)
      DELETE /complaints/:id -> Público (Atenção com a segurança)
  */

  @Get()
  findAll(@Query('topico') topico?: 'Aulas' | 'Diretores' | 'Alunos' | 'Atividades' | 'Extracurriculares') {
    return this.complaintsService.findAll(topico);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.complaintsService.findOne(id);
  }

  @Post()
  create(@Body() createDto: CreateComplaintsDTO) {
    // Nenhuma informação de usuário é necessária ou passada.
    return this.complaintsService.create(createDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateComplaintsDTO) {
    // Qualquer pessoa pode chamar esta rota.
    return this.complaintsService.update(id, updateDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    // Qualquer pessoa pode chamar esta rota.
    return this.complaintsService.delete(id);
  }
}