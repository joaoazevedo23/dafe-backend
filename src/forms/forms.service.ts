import { Injectable, NotFoundException } from '@nestjs/common';
import { Forms, FormsDocument } from '../../models/forms.schema'
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateFormDto } from './create.form.dto';
import { UpdateFormDto } from './update.form.dto';

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

  async update(id: string, UpdateFormDto: UpdateFormDto): Promise<Forms> {
    const formsUpdated = await this.formsModel
    .findByIdAndUpdate(id, UpdateFormDto, { new: true })
    .exec();

    if (!formsUpdated) {
      throw new NotFoundException(`Formulário com ID "${id}" não encontrado.`);
    }

    return formsUpdated;
  }

}


