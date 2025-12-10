import { Controller, Get, Param, Post, Body, Req, UseGuards } from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { JwtAuthGuard } from 'src/login-jwt/jwt-auth.guard';
import { UserRole } from 'src/models/user.schema';
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { CreateResponseDto } from './dto/create-response.dto';
import { Request } from 'express';
import { UserPayload } from '../forms/forms.controller';

@Controller('responses')
@UseGuards(JwtAuthGuard)
export class ResponsesController {
    constructor(private readonly responsesService: ResponsesService) {}

    @Post()
    submit(@Body() createResponseDto: CreateResponseDto, @Req() req: Request) {
        const user = (req as any).user as UserPayload;
        return this.responsesService.submitResponse(createResponseDto, user.id);
    }

    @Get('results/:formIdOrSlug')
    @Roles(UserRole.PROFESSOR, UserRole.MANAGER, UserRole.ADMIN)
    @UseGuards(RolesGuard)
    getResults(@Param('formIdOrSlug') formIdOrSlug: string) {
        return this.responsesService.getResultsByFormId(formIdOrSlug);
    }

    @Get('hasResponded/:formId')
    hasResponded(@Param('formId') formId: string, @Req() req: Request) {
        const user = (req as any).user as UserPayload;
        return this.responsesService.hasUserResponded(formId, user.id);
    }

    @Get("answeredFormsIds")
    async getAnsweredFormsIds(@Req() req: Request) {
        const user = (req as any).user as UserPayload;
        return this.responsesService.getAnsweredFormsIds(user.id);
    }
}
