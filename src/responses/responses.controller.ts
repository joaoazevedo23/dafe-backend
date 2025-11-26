// src/responses/responses.controller.ts

import { Controller, Get, Param, Post, Body, Req, UseGuards } from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { JwtAuthGuard } from 'src/login-jwt/jwt-auth.guard';
import { UserRole } from 'models/user.schema';
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { CreateResponseDto } from './dto/create-response.dto';
import { Request } from 'express'; 
import { UserPayload } from '../forms/forms.controller'; // Reutilizando a interface UserPayload

@Controller('responses')
@UseGuards(JwtAuthGuard)
export class ResponsesController {
    constructor(private readonly responsesService: ResponsesService) {}

    // Rota de Submissão: POST /responses
    // Requer apenas que o usuário esteja logado
    @Post()
    submit(@Body() createResponseDto: CreateResponseDto, @Req() req: Request) {
        // Assume que req.user foi injetado pelo JwtAuthGuard
        const user = (req as any).user as UserPayload; 
        return this.responsesService.submitResponse(createResponseDto, user.id);
    }

    // Rota de Visualização de Resultados: GET /responses/results/:formIdOrSlug
    // Requer permissão de gestor para visualizar os dados
    @Get('results/:formIdOrSlug')
    @Roles(UserRole.PROFESSOR, UserRole.MANAGER, UserRole.ADMIN) 
    @UseGuards(RolesGuard)
    getResults(@Param('formIdOrSlug') formIdOrSlug: string) {
        // O serviço faz a mesclagem e retorna os resultados estruturados
        return this.responsesService.getResultsByFormId(formIdOrSlug);
    }
}