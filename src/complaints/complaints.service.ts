import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Complaints, ComplaintsSchema } from '../../models/complaints.schema';
import { CreateComplaintsDTO } from './dtos/create-complaints.dto';
import { UpdateComplaintsDTO } from './dtos/update-complaints.dto';

@Injectable()
export class ComplaintsService {
  constructor(
    @InjectModel(Complaints.name)
    private readonly complaintsModel: Model<ComplaintsSchema>,
  ) {}

  // Busca todas as denúncias, podendo filtrar pelo tópico
  async findAll(topico?: string): Promise<Complaints[]> {
    const query = topico ? { topico } : {};
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

  // Cria uma nova denúncia
  async create(createDto: CreateComplaintsDTO): Promise<Complaints> {
    const newComplaint = new this.complaintsModel(createDto);
    return await newComplaint.save();
  }

  // Atualiza uma denúncia pelo id ou slug
  async update(idOrSlug: string, updateDto: UpdateComplaintsDTO): Promise<Complaints> {
    let updatedComplaint: Complaints | null = null;

    // Se for um ObjectId válido, tenta atualizar pelo id
    if (isValidObjectId(idOrSlug)) {
      updatedComplaint = await this.complaintsModel.findByIdAndUpdate(idOrSlug, updateDto, { new: true }).exec();
    }

    // Se não encontrou para atualizar pelo id, tenta pelo slug
    if (!updatedComplaint) {
      updatedComplaint = await this.complaintsModel.findOneAndUpdate({ slug: idOrSlug }, updateDto, { new: true }).exec();
    }

    // Se não encontrou para atualizar, lança exceção
    if (!updatedComplaint) {
      throw new NotFoundException(`Denúncia com id ou slug "${idOrSlug}" não encontrada`);
    }

    return updatedComplaint;
  }

  // Deleta uma denúncia pelo id ou slug
  async delete(idOrSlug: string): Promise<{ message: string }> {
    let deletedComplaint: Complaints | null = null;

    // Se for ObjectId válido, tenta deletar pelo id
    if (isValidObjectId(idOrSlug)) {
      deletedComplaint = await this.complaintsModel.findByIdAndDelete(idOrSlug).exec();
    }

    // Se não encontrou para deletar pelo id, tenta pelo slug
    if (!deletedComplaint) {
      deletedComplaint = await this.complaintsModel.findOneAndDelete({ slug: idOrSlug }).exec();
    }

    // Se não encontrou para deletar, lança exceção
    if (!deletedComplaint) {
      throw new NotFoundException(`Denúncia com id ou slug "${idOrSlug}" não encontrada`);
    }

    return { message: `Denúncia com id ou slug "${idOrSlug}" deletada com sucesso.` };
  }
}
