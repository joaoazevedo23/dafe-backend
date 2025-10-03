import { Controller, Post, Param, Body, Get, UseGuards, Req } from '@nestjs/common';
import { ResponseService } from './response.service';
import { CreateResponseDto } from './dtos/create-response.dto';
import { JwtAuthGuard } from 'src/login-jwt/jwt-auth.guard'; 
import { Request } from 'express';

interface UserPayload {
  id: string;
  role: string;
}

@UseGuards(JwtAuthGuard) 
@Controller('forms') 
export class ResponseController {
  constructor(private readonly responseService: ResponseService) { }

  @Post(':formId/responses') 
  async createResponse(
    @Param('formId') formId: string,
    @Body() body: CreateResponseDto,
    @Req() req: Request 
  ) {
    const user = req.user as UserPayload;

    return this.responseService.create(formId, user.id, body.respostas);
  }

  @Get(':formId/responses') 
  async getResponses(@Param('formId') formId: string) {
    return this.responseService.findAll(formId);
  }
}