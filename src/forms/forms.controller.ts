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

interface UserPayload {
  id: string;
  role: UserRole;
}

@UseGuards(JwtAuthGuard)
@Controller('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Post()
  @Roles(UserRole.PROFESSOR, UserRole.MANAGER)
  @UseGuards(RolesGuard)
  create(@Body() createFormDto: CreateFormDto) {
    return this.formsService.create(createFormDto);
  }

  @Get()
  findAll() {
    return this.formsService.findAll();
  }

  // Alterar para idOrSlug
  @Get(':idOrSlug')
  findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.formsService.findOne(idOrSlug);
  }

  @Patch(':idOrSlug')
  @Roles(UserRole.PROFESSOR, UserRole.MANAGER)
  @UseGuards(RolesGuard)
  update(
    @Param('idOrSlug') idOrSlug: string,
    @Body() updateFormDto: UpdateFormDto,
    @Req() req: Request,
  ) {
    const user = req.user as UserPayload;
    return this.formsService.update(idOrSlug, updateFormDto, user);
  }

  @Delete(':idOrSlug')
  @Roles(UserRole.PROFESSOR, UserRole.MANAGER)
  @UseGuards(RolesGuard)
  remove(@Param('idOrSlug') idOrSlug: string, @Req() req: Request) {
    const user = req.user as UserPayload;
    return this.formsService.remove(idOrSlug, user);
  }
}
