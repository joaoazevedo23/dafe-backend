import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Complaints, ComplaintsSchema } from '../../models/complaints.schema';
import { CreateComplaintsDTO } from './dtos/create-complaints.dto';
import { UpdateComplaintsDTO } from './dtos/update-complaints.dto';
import { UserRole } from '../../models/user.schema';

@Injectable()
export class ComplaintsService {

  //Mapa de Destino
  private readonly destinoRoleMap: { [key: string]: string } = {
    Aulas: 'professor',
    Diretores: 'admin',
    Alunos: 'manager',
    Atividades: 'professor',
    Extracurriculares: 'manager',
  };

  constructor(
    @InjectModel(Complaints.name)
    private readonly complaintsModel: Model<ComplaintsSchema>,
  ) { }

  // Determinar o destinoRole com base no tópico
  private determineDestinoRole(topico: string): string {
    return this.destinoRoleMap[topico] || 'admin';
  }

  // Permissão do usuário para modificar ou deletar denúncia
  private checkPermisson(complaint: Complaints, userRole: UserRole): void {
    if (userRole === UserRole.ADMIN) {
      return;
    }
    if (complaint.destinoRole !== userRole) {
      throw new UnauthorizedException('Você não tem permissão para modificar ou deletar esta denúncia. Ela está destinada ao cargo de ' + complaint.destinoRole);
    }
  }

  async findAll(topico?: string, destinoRole?: string): Promise<Complaints[]> {
    const query: any = {};
    if (topico) {
      query.topico = topico;
    }
    if (destinoRole) {
      query.destinoRole = destinoRole;
    }
    return this.complaintsModel.find(query).sort({ createdAt: -1 }).exec();
  }

  async findOne(idOrSlug: string): Promise<Complaints> {
    let complaint: Complaints | null = null;
    // Verifica se idOrSlug é um ObjectId válido
    if (isValidObjectId(idOrSlug)) {
      // Busca pelo id
      complaint = await this.complaintsModel.findById(idOrSlug).exec();
    }
    // Se não encontrou pelo id, busca pelo slug
    if (!complaint) {
      complaint = await this.complaintsModel.findOne({ slug: idOrSlug }).exec();
    }
    if (!complaint) {
      throw new NotFoundException(`Denúncia com id ou slug "${idOrSlug}" não encontrada`);
    }
    return complaint;
  }

  async create(createDto: CreateComplaintsDTO): Promise<Complaints> {
    const destinoRole = this.determineDestinoRole(createDto.topico);
    const complaintWithDestino = {
      ...createDto,
      destinoRole: destinoRole,
    };
    const newComplaint = new this.complaintsModel(complaintWithDestino);
    return await newComplaint.save();
  }

  async update(idOrSlug: string, updateDto: UpdateComplaintsDTO, userRole: UserRole): Promise<Complaints> {
    let existingComplaint: Complaints | null = null;
    let updatedComplaint: Complaints | null = null;

    // Encontrar a denúncia existente
    if (isValidObjectId(idOrSlug)) {
      existingComplaint = await this.complaintsModel.findById(idOrSlug).exec();
    }
    if (!existingComplaint) {
      existingComplaint = await this.complaintsModel.findOne({ slug: idOrSlug }).exec();
    }
    if (!existingComplaint) {
      throw new NotFoundException(`Denúncia com id ou slug "${idOrSlug}" não encontrada`);
    }

    // Verificar permissões
    this.checkPermisson(existingComplaint, userRole);

    // Atualizar a denúncia
    updatedComplaint = await this.complaintsModel.findByIdAndUpdate((existingComplaint as any)._id, updateDto, { new: true }).exec();
    
    if (!updatedComplaint) {
      // Precaução
      throw new NotFoundException(`Denúncia com id ou slug "${idOrSlug}" não encontrada após permissão.`);
      }

    return updatedComplaint;
  }

  async delete(idOrSlug: string, userRole: UserRole): Promise<{ message: string }> {
    let deletedComplaint: Complaints | null = null;

    // Se for ObjectId válido, tenta deletar pelo id
    if (isValidObjectId(idOrSlug)) {
      deletedComplaint = await this.complaintsModel.findById(idOrSlug).exec();
    }

    // Se não encontrou para deletar pelo id, tenta pelo slug
    if (!deletedComplaint) {
      deletedComplaint = await this.complaintsModel.findOne({ slug: idOrSlug }).exec();
    }

    if (!deletedComplaint) {
      throw new NotFoundException(`Denúncia com id ou slug "${idOrSlug}" não encontrada`);
    }

    this.checkPermisson(deletedComplaint, userRole);
    await this.complaintsModel.deleteOne({ _id: (deletedComplaint as any)._id }).exec();

    return { message: `Denúncia com id ou slug "${idOrSlug}" deletada com sucesso.` };
  }
}
