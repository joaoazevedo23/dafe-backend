// src/forms/forms.controller.ts
import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { FormsService } from './forms.service';
import { CreateFormDto } from './dto/create-form.dto';
import { JwtAuthGuard } from 'src/login-jwt/jwt-auth.guard';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { UserRole } from 'models/user.schema';

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
@Controller('forms')
export class FormsController {
  constructor(
    private readonly formsService: FormsService) {}

  @Get()
  findAll() {
    return this.formsService.findAll();
  }

  // Alterar para idOrSlug
  @Get(':idOrSlug')
  findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.formsService.findOne(idOrSlug);
  }

  @Post()
  @Roles(UserRole.MANAGER, UserRole.PROFESSOR, UserRole.ADMIN) 
  @UseGuards(RolesGuard)
  create(@Body() createFormDto: CreateFormDto) {
    return this.formsService.create(createFormDto);
  }

  @Delete(':id')
  @Roles(UserRole.MANAGER, UserRole.PROFESSOR, UserRole.ADMIN) 
  @UseGuards(RolesGuard)
  remove(@Param('id') id: string) {
    return this.formsService.remove(id);
  }
}
