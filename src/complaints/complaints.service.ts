import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Complaints, ComplaintsSchema } from '../../models/complaints.schema';
import { Model } from 'mongoose';
import { CreateComplaintsDTO } from './dtos/create-complaints.dto';
import { validateId } from 'src/utils/validate-id';

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
    
      // Buscar uma complaints por id
      async findOne(id: string): Promise<Complaints> {
        const Complaints = await this.complaintsModel.findById(id).exec();
        
        validateId(id);
        if (!Complaints) {
          throw new NotFoundException(`Denúncia com id ${id} não encontrado`);
        }
        return Complaints;
      }
    
      // Criar novo complaints
      async create(createcomplts: CreateComplaintsDTO): Promise<Complaints> {
          const novoComplaints = new this.complaintsModel(createcomplts);
          return await novoComplaints.save();
      }


      // Atualizar complaints por iD --> criada só por preucaução
      async update(id: string, ComplaintsData: Partial<Complaints>): Promise<Complaints> {

        validateId(id); 
        const Complaints = await this.complaintsModel.findByIdAndUpdate(id, ComplaintsData, { new: true }).exec();
        if (!Complaints) {
          throw new NotFoundException(`Complaints com id ${id} não encontrado`);
        }
        return Complaints;  
      }
    
      // Deletar por ID
      async delete(id: string): Promise<{ message: string }> {

        validateId(id); 
        const Complaints = await this.complaintsModel.findByIdAndDelete(id).exec();
        if (!Complaints) {
          throw new NotFoundException(`Denúncia com id ${id} não encontrado`);
        }
        return { message: `Denúncia com id ${id} foi deletado com sucesso.` };
      }
}
