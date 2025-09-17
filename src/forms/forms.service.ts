import { Injectable } from '@nestjs/common';
import { Forms, FormsDocument } from '../../models/forms.schema'
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateFormDto } from './create.form.dro';

@Injectable()
export class FormsService {
    constructor(
        @InjectModel(Forms.name) private readonly formsModel: Model<FormsDocument>
    ) {} 

    /**
   * @description Busca todos os formulários no banco de dados, ordenados pelos mais recentes.
   * @returns {Promise<Forms[]>} Uma lista de formulários.
   */
  async findAll(): Promise<Forms[]> {
    return this.formsModel
      .find() // O .find() sem argumentos busca todos os documentos
      .sort({ createdAt: -1 }) // ordem mais recentes
      .exec(); 
  }

  async create(CreateFormDto: CreateFormDto): Promise<Forms> {
    const novoFormulario = new this.formsModel(CreateFormDto);
    return novoFormulario.save();
  }

}


