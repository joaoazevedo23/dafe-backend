import {Controller, HttpStatus, Get, Post, Patch, Delete, Param, Query, Body, HttpCode, Req, UseGuards} from '@nestjs/common';
import { Request } from 'express';
import { NewsService } from './news.service';
import { CreateNewsDTO } from './dtos/create-news.dto';
import { UpdateNewsDTO } from './dtos/update-news.dto';
import { UserRole } from '../../models/user.schema'; 
import { JwtAuthGuard } from 'src/login-jwt/jwt-auth.guard';
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { Roles } from 'src/utils/decorators/roles.decorator';

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
@Controller('news')
export class NewsController {
    constructor(private readonly newsService: NewsService) {}

    // Rota: GET /news
    @Get()
    findAll(@Query('autor') autor?: string) {
        return this.newsService.findAll(autor);
    }

    // Rota: GET /news/:id
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.newsService.findOne(id);
    }

    // Rota: POST /news
    @Post()
    @Roles(UserRole.PROFESSOR, UserRole.STUDENT, UserRole.MANAGER)
    @UseGuards(RolesGuard)
    @HttpCode(HttpStatus.CREATED) // Retorna 201 Created
    create(@Body() createNewsDTO: CreateNewsDTO, @Req() req: Request) {
        const user = req.user as UserPayload;
        return this.newsService.create(createNewsDTO, user.id);
    }

    // Rota: Patch /news/:id
    @Patch(':id')
    @Roles(UserRole.PROFESSOR, UserRole.STUDENT, UserRole.MANAGER)
    @UseGuards(RolesGuard)
    update(@Param('id') id: string, @Body() updateNewsDTO: UpdateNewsDTO, @Req() req: Request) {
        const user = req.user as UserPayload;
        return this.newsService.update(id, updateNewsDTO, user.id);
    }

    // Rota: DELETE /news/:id
    @Delete(':id')
    @Roles(UserRole.PROFESSOR, UserRole.STUDENT, UserRole.MANAGER)
    @UseGuards(RolesGuard)
    @HttpCode(HttpStatus.OK)
    delete(@Param('id') id: string, @Req() req: Request) {
        const user = req.user as UserPayload;
        return this.newsService.delete(id, user.id);
    }
}