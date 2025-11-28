import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ComplaintsService } from './complaints.service';
import { CreateComplaintsDTO } from './dtos/create-complaints.dto';
import { UpdateComplaintsDTO } from './dtos/update-complaints.dto';
import { JwtAuthGuard } from 'src/login-jwt/jwt-auth.guard';
import { UserRole } from '../models/user.schema';
import { GetUserRole } from 'src/utils/decorators/get-user-role.decorator';
import { UpdateComplaintStatusDto } from './dtos/update-complaints-status.dto';
import { UserPayload } from 'src/forms/forms.controller';
import { ComplaintStatus } from 'src/models/complaints.schema';

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
    @Query('topico') topico?: 'Alunos' | 'Professores' | 'Funcionários' | 'Coordenação' | 'Direção',
    @Query('status') status?: ComplaintStatus
  ) {

    let destinoFilter: UserRole | undefined = undefined;
    if (userRole !== UserRole.ADMIN) {
      destinoFilter = userRole;
    }

    return this.complaintsService.findAll(topico, destinoFilter, status);
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

  @Patch('status/:id')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateComplaintStatusDto,
    @Req() req: Request
  ) {
    const user = (req as any).user as UserPayload;

    return this.complaintsService.updateStatus(id, updateStatusDto.status, user);
  }

  @Delete(':idOrSlug')
  delete(
    @GetUserRole() userRole: UserRole,
    @Param('idOrSlug') idOrSlug: string
  ) {
    return this.complaintsService.delete(idOrSlug, userRole);
  }
}
