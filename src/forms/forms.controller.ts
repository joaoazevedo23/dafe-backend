import { Controller, Get, UseGuards, Post, Body, Patch, Param } from '@nestjs/common';
import { FormsService } from './forms.service';
import { JwtAuthGuard } from 'src/login-jwt/jwt-auth.guard';
import { CreateFormDto } from './create.form.dto';
import { UpdateFormDto } from './update.form.dto';

@UseGuards(JwtAuthGuard)
@Controller('forms')
export class FormsController {
    constructor(private readonly formsService: FormsService){}

    /**
   * @description Rota para buscar todos os formulários.
   * @returns {Promise<Forms[]>} Uma lista de todos os formulários.
   */
  
  @Get() 
  findAll() {
    return this.formsService.findAll(); 
  }

  @Post() // só vai responder requisições post
  create(@Body() CreateFormDto: CreateFormDto) {
    return this.formsService.create(CreateFormDto);
  }

  @Patch(':id') // responde requisições PATCH para /forms/ID_DO_FORM
  update(@Param('id') id: string, @Body() UpdateFormDto: UpdateFormDto) {
    return this.formsService.update(id, UpdateFormDto);
  }
}
