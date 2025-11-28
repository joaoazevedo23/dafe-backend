import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { FormsService } from './forms.service';
import { CreateFormDto } from './dto/create-form.dto';
import { JwtAuthGuard } from 'src/login-jwt/jwt-auth.guard';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { UserRole } from 'src/models/user.schema';
import { RolesGuard } from 'src/utils/guards/roles.guard';

export interface UserPayload {
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
  constructor(private readonly formsService: FormsService) {}

  @Post()
  @Roles(UserRole.PROFESSOR, UserRole.MANAGER, UserRole.ADMIN)
  @UseGuards(RolesGuard)
  create(@Body() createFormDto: CreateFormDto, @Req() req: Request) {
    const user = (req as any).user as UserPayload;
    return this.formsService.create(createFormDto, user.id);
  }

  @Get()
  findAll() {
    return this.formsService.findAll();
  }

  @Get(':idOrSlug')
  findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.formsService.findOne(idOrSlug);
  }

  @Delete(':id')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @UseGuards(RolesGuard)
  deleteOne(@Param('id') id: string) {
    return this.formsService.deleteOne(id);
  }
}
