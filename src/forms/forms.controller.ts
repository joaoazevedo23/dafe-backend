import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { FormsService } from './forms.service';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { JwtAuthGuard } from 'src/login-jwt/jwt-auth.guard';
import { UserRole } from 'models/user.schema';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { RolesGuard } from 'src/utils/guards/roles.guard';

// Definindo o tipo do payload do usuário que vem no token
interface UserPayload {
  id: string;
  role: UserRole;
}

@UseGuards(JwtAuthGuard)
@Controller('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Post()
  @Roles(UserRole.PROFESSOR, UserRole.MANAGER) // Apenas professores ou gestores criam forms
  @UseGuards(RolesGuard)
  create(@Body() createFormDto: CreateFormDto) {
    return this.formsService.create(createFormDto);
  }

  @Get()
  findAll() {
    return this.formsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.formsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.PROFESSOR, UserRole.MANAGER)
  @UseGuards(RolesGuard)
  update(
    @Param('id') id: string,
    @Body() updateFormDto: UpdateFormDto,
    @Req() req: Request,
  ) {
    const user = req.user as UserPayload;
    return this.formsService.update(id, updateFormDto, user);
  }

  @Delete(':id')
  @Roles(UserRole.PROFESSOR, UserRole.MANAGER)
  @UseGuards(RolesGuard)
  remove(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as UserPayload;
    return this.formsService.remove(id, user);
  }
}