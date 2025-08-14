import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Complaints, ComplaintsSchema } from '../../models/complaints.schema';
import { CreateComplaintsDTO } from './dtos/create-complaints.dto';
import { UpdateComplaintsDTO } from './dtos/update-complaints.dto';
import { validateId } from 'src/utils/decorators/validate-id';

@Injectable()
export class ComplaintsService {
  constructor(
    // Correção de tipo para o documento do Mongoose
    @InjectModel(Complaints.name)
    private readonly complaintsModel: Model<ComplaintsSchema>,
  ) {}

  async findAll(topico?: string): Promise<Complaints[]> {
    // Lógica de busca otimizada
    const query = topico ? { topico: topico } : {};
    return this.complaintsModel.find(query).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Complaints> {
    // Validação do ID antes da consulta ao banco
    validateId(id);
    const complaint = await this.complaintsModel.findById(id).exec();

    if (!complaint) {
      throw new NotFoundException(`Denúncia com id ${id} não encontrada`);
    }
    return complaint;
  }

  async create(createDto: CreateComplaintsDTO): Promise<Complaints> {
    const newComplaint = new this.complaintsModel(createDto);
    return await newComplaint.save();
  }

  async update(id: string, updateDto: UpdateComplaintsDTO): Promise<Complaints> {
    // Validação do ID antes da consulta ao banco
    validateId(id);
    const updatedComplaint = await this.complaintsModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();

    if (!updatedComplaint) {
      throw new NotFoundException(`Denúncia com id ${id} não encontrada`);
    }
    return updatedComplaint;
  }

  async delete(id: string): Promise<{ message: string }> {
    // Validação do ID antes da consulta ao banco
    validateId(id);
    const deletedComplaint = await this.complaintsModel.findByIdAndDelete(id).exec();

    if (!deletedComplaint) {
      throw new NotFoundException(`Denúncia com id ${id} não encontrado`);
    }
    return { message: `Denúncia com id ${id} foi deletada com sucesso.` };
  }
}