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
    findAll(@Req() req: Request, @Query('autor') autor?: string) {
        const user = req.user as UserPayload;
        
        let curso: string | undefined = undefined;
        let modulo: number | undefined = undefined;

        if (user.role === UserRole.STUDENT && user.curso && user.modulo) {
            curso = user.curso;
            modulo = user.modulo;
        }

        return this.newsService.findAll(autor, user.role, curso, modulo);
    }

    @Get(':idOrSlug')
    findOne(@Param('idOrSlug') idOrSlug: string) {
        return this.newsService.findOne(idOrSlug);
    }

    @Post()
    @Roles(UserRole.PROFESSOR, UserRole.MANAGER, UserRole.ADMIN)
    @UseGuards(RolesGuard)
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createNewsDTO: CreateNewsDTO, @Req() req: Request) {
        const user = req.user as UserPayload;
        return this.newsService.create(createNewsDTO, user.id);
    }

    @Patch(':idOrSlug')
    @UseGuards(RolesGuard)
    update(@Param('idOrSlug') idOrSlug: string, @Body() updateNewsDTO: UpdateNewsDTO, @Req() req: Request) {
        const user = req.user as UserPayload;
        return this.newsService.update(idOrSlug, updateNewsDTO, user.id);
    }

    @Delete(':idOrSlug')
    @Roles(UserRole.MANAGER, UserRole.ADMIN)
    @UseGuards(RolesGuard)
    @HttpCode(HttpStatus.OK)
    delete(@Param('idOrSlug') idOrSlug: string, @Req() req: Request) {
        const user = req.user as UserPayload;
        return this.newsService.delete(idOrSlug, user.id);
    }
}