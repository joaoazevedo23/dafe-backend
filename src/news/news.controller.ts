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

  @Get()
  findAll(@Query('autor') autor?: string) {
    return this.newsService.findAll(autor);
  }

  @Get(':idOrSlug')
  findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.newsService.findOne(idOrSlug);
  }

  @Post()
  @Roles(UserRole.PROFESSOR, UserRole.STUDENT, UserRole.MANAGER)
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createNewsDTO: CreateNewsDTO, @Req() req: Request) {
    const user = req.user as UserPayload;
    return this.newsService.create(createNewsDTO, user.id);
  }

  @Patch(':idOrSlug')
  @Roles(UserRole.PROFESSOR, UserRole.STUDENT, UserRole.MANAGER)
  @UseGuards(RolesGuard)
  update(@Param('idOrSlug') idOrSlug: string, @Body() updateNewsDTO: UpdateNewsDTO, @Req() req: Request) {
    const user = req.user as UserPayload;
    return this.newsService.update(idOrSlug, updateNewsDTO, user.id);
  }

  @Delete(':idOrSlug')
  @Roles(UserRole.PROFESSOR, UserRole.STUDENT, UserRole.MANAGER)
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  delete(@Param('idOrSlug') idOrSlug: string, @Req() req: Request) {
    const user = req.user as UserPayload;
    return this.newsService.delete(idOrSlug, user.id);
  }
}
