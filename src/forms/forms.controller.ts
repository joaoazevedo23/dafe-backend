import { Controller, Get, UseGuards, Post, Body } from '@nestjs/common';
import { FormsService } from './forms.service';
import { JwtAuthGuard } from 'src/login-jwt/jwt-auth.guard';
import { CreateFormDto } from './create.form.dro';

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
}
