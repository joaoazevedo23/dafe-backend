import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ComplaintsService } from './complaints.service';
import { CreateComplaintsDTO } from './dtos/create-complaints.dto';
import { UpdateComplaintsDTO } from './dtos/update-complaints.dto';
import { JwtAuthGuard } from 'src/login-jwt/jwt-auth.guard';
import { User, UserRole } from '../../models/user.schema';
import { GetUserRole } from 'src/utils/decorators/get-user-role.decorator';

@UseGuards(JwtAuthGuard)
@Controller('complaints')
export class ComplaintsController {
  constructor(private readonly complaintsService: ComplaintsService) { }

  /* GET /complaints      -> Público
      GET /complaints/:id    -> Público
      POST /complaints       -> Público
      PATCH /complaints/:id  -> Público 
      DELETE /complaints/:id -> Público 
  */

  @Get()
  findAll(
    @GetUserRole() userRole: UserRole,
    @Query('topico') topico?: 'Aulas' | 'Diretores' | 'Alunos' | 'Atividades' | 'Extracurriculares',
  ) {

    let destinoFilter: UserRole | undefined = undefined;
    if (userRole !== UserRole.ADMIN) {
      destinoFilter = userRole;
    }

    return this.complaintsService.findAll(topico, destinoFilter);
  }

  @Get(':idOrSlug')
  findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.complaintsService.findOne(idOrSlug);
  }

  @Post()
  create(@Body() createDto: CreateComplaintsDTO) {
    return this.complaintsService.create(createDto);
  }

  @Patch(':idOrSlug')
  update(
    @GetUserRole() userRole: UserRole, 
    @Param('idOrSlug') idOrSlug: string,
    @Body() updateDto: UpdateComplaintsDTO
  ) {
    return this.complaintsService.update(idOrSlug, updateDto, userRole);
  }

  @Delete(':idOrSlug')
  delete(
    @GetUserRole() userRole: UserRole, 
    @Param('idOrSlug') idOrSlug: string
  ) {
    return this.complaintsService.delete(idOrSlug, userRole);
  }
}
