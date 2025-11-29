import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Complaints, ComplaintsSchema, ComplaintStatus } from '../models/complaints.schema';
import { CreateComplaintsDTO } from './dtos/create-complaints.dto';
import { UpdateComplaintsDTO } from './dtos/update-complaints.dto';
import { UserRole } from '../models/user.schema';
import { UserPayload } from 'src/forms/forms.controller';

@Injectable()
export class ComplaintsService {

  private readonly destinoRoleMap: { [key: string]: string } = {
    Alunos: 'professor',
    Professores: 'manager',
    Funcionários: 'manager',
    Coordenação: 'admin',
    Direção: 'admin',
  };

  constructor(@InjectModel(Complaints.name) private readonly complaintsModel: Model<ComplaintsSchema>) { }

  private determineDestinoRole(topico: string): string {
    return this.destinoRoleMap[topico];
  }

  private checkActionPermission(
    complaint: Complaints,
    userRole: UserRole | string
  ):
    void {

    if (userRole === UserRole.ADMIN) {
      return;
    }
    if (complaint.destinoRole !== userRole) {
      throw new ForbiddenException(`Você não tem permissão para modificar esta denúncia. Destino: ${complaint.destinoRole}`);
    }
  }

  async updateStatus(
    complaintId: string,
    newStatus: ComplaintStatus,
    user: UserPayload
  ):
    Promise<Complaints> {
    const complaint = await this.complaintsModel.findById(complaintId).exec();
    if (!complaint) {
      throw new NotFoundException('Denúncia não encontrada.');
    }
    this.checkActionPermission(complaint, user.role);
    const updatedComplaint = await this.complaintsModel.findByIdAndUpdate(
      complaintId,
      { status: newStatus },
      { new: true }
    ).exec();
    return updatedComplaint!;
  }

  async findAll(topico?: string, destinoRole?: string, status?: ComplaintStatus): Promise<Complaints[]> {
    const query: any = {};
    if (topico) {
      query.topico = topico;
    }
    if (destinoRole) {
      query.destinoRole = destinoRole;
    }
    if (status) {
      query.status = status;
    }
    return this.complaintsModel.find(query).sort({ createdAt: -1 }).exec();
  }

  async findOne(idOrSlug: string): Promise<Complaints> {
    let complaint: Complaints | null = null;
    if (isValidObjectId(idOrSlug)) {
      complaint = await this.complaintsModel.findById(idOrSlug).exec();
    }
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

    if (isValidObjectId(idOrSlug)) {
      existingComplaint = await this.complaintsModel.findById(idOrSlug).exec();
    }
    if (!existingComplaint) {
      existingComplaint = await this.complaintsModel.findOne({ slug: idOrSlug }).exec();
    }
    if (!existingComplaint) {
      throw new NotFoundException(`Denúncia com id ou slug "${idOrSlug}" não encontrada`);
    }
    this.checkActionPermission(existingComplaint, userRole);
    const updatedComplaint = await this.complaintsModel.findByIdAndUpdate((existingComplaint as any)._id, updateDto, { new: true }).exec();
    if (!updatedComplaint) {
      throw new NotFoundException(`Denúncia com id ou slug "${idOrSlug}" não encontrada após permissão.`);
    }

    return updatedComplaint;
  }

  async delete(idOrSlug: string, userRole: UserRole): Promise<{ message: string }> {
    let deletedComplaint: Complaints | null = null;
    if (isValidObjectId(idOrSlug)) {
      deletedComplaint = await this.complaintsModel.findById(idOrSlug).exec();
    }
    if (!deletedComplaint) {
      deletedComplaint = await this.complaintsModel.findOne({ slug: idOrSlug }).exec();
    }
    if (!deletedComplaint) {
      throw new NotFoundException(`Denúncia com id ou slug "${idOrSlug}" não encontrada`);
    }
    this.checkActionPermission(deletedComplaint, userRole);
    await this.complaintsModel.deleteOne({ _id: (deletedComplaint as any)._id }).exec();

    return { message: `Denúncia com id ou slug "${idOrSlug}" deletada com sucesso.` };
  }
}