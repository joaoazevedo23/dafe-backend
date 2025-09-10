import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { AnswersService } from './answer.service'; 
import { CreateAnswerDto } from './dto/create-answer.dto';
import { JwtAuthGuard } from 'src/login-jwt/jwt-auth.guard';
import { UserRole } from 'models/user.schema';

interface UserPayload {
  id: string;
  role: UserRole;
}

@UseGuards(JwtAuthGuard)
@Controller('answers')
export class AnswersController {
  constructor(private readonly answersService: AnswersService) {}

  @Post()
  create(@Body() createAnswerDto: CreateAnswerDto, @Req() req: Request) {
    const user = req.user as UserPayload;
    return this.answersService.create(createAnswerDto, user.id);
  }

  @Get('form/:formId')
  findAllByForm(@Param('formId') formId: string) {
    return this.answersService.findAllByForm(formId);
  }
}