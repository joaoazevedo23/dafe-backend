import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Complaints, ComplaintsSchema } from '../../models/complaints.schema';
import { Model } from 'mongoose';

@Injectable()

export class ComplaintsService {
    
      constructor(
        @InjectModel(Complaints.name) private readonly complaintsModel: Model<ComplaintsSchema>,
      ) {}
    
      // Buscar todos os complaints ou filtrar por tópico
      async findAll(topico?: string): Promise<Complaints[]> {
        if (topico) {
            return this.complaintsModel.find({ topico: topico }).exec();
        }
        return this.complaintsModel.find().exec();
      }
    
      // Buscar um Complaints por ID
      async findOne(id: string): Promise<Complaints> {
        const Complaints = await this.complaintsModel.findById(id).exec();
        if (!Complaints) {
          throw new NotFoundException(`Complaints com id ${id} não encontrado`);
        }
        return Complaints;
      }
    
      // Criar novo Complaints
      async create(ComplaintsData: Partial<Complaints>): Promise<Complaints> {
        console.log('Recebido:', ComplaintsData);
        try {
          const novoComplaints = new this.complaintsModel(ComplaintsData);
          return await novoComplaints.save();
        } catch (err) {
          console.error('Erro ao salvar Complaints:', err);
          throw err;
        }
      }
    
      // Deletar por ID
      async delete(id: string): Promise<{ message: string }> {
        const Complaints = await this.complaintsModel.findByIdAndDelete(id).exec();
        if (!Complaints) {
          throw new NotFoundException(`Complaints com id ${id} não encontrado`);
        }
        return { message: `Complaints com id ${id} foi deletado com sucesso.` };
      }
}
