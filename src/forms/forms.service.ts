import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Forms, FormsDocument } from '../../models/forms.schema';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { validateId } from '../utils/decorators/validate-id';
import { UserRole } from 'models/user.schema';

interface UserPayload {
  id: string;
  role: UserRole;
}

@Injectable()
export class FormsService {
  constructor(
    @InjectModel(Forms.name) private readonly formsModel: Model<FormsDocument>,
  ) {}

  async create(createFormDto: CreateFormDto): Promise<Forms> {
    const newForm = new this.formsModel(createFormDto);
    return await newForm.save();
  }

  async findAll(): Promise<Forms[]> {
    return this.formsModel.find().exec();
  }

  async findOne(id: string): Promise<Forms> {
    validateId(id);
    const form = await this.formsModel.findById(id).exec();

    if (!form) {
      throw new NotFoundException(`Formulário com ID "${id}" não encontrado.`);
    }
    return form;
  }

  async update(id: string, updateFormDto: UpdateFormDto, user: UserPayload): Promise<Forms> {
    validateId(id);

    // Adicionando lógica de permissão (ex: somente professores/managers podem editar)
    if (user.role !== UserRole.PROFESSOR && user.role !== UserRole.MANAGER) {
        throw new NotFoundException('Você não tem permissão para editar este formulário.');
    }

    const updatedForm = await this.formsModel
      .findByIdAndUpdate(id, updateFormDto as import('mongoose').UpdateQuery<FormsDocument>, { new: true })
      .exec();

    if (!updatedForm) {
      throw new NotFoundException(`Formulário com ID "${id}" não encontrado.`);
    }
    return updatedForm;
  }

  async remove(id: string, user: UserPayload): Promise<{ message: string }> {
    validateId(id);

    // Adicionando lógica de permissão
    if (user.role !== UserRole.PROFESSOR && user.role !== UserRole.MANAGER) {
        throw new NotFoundException('Você não tem permissão para deletar este formulário.');
    }
    
    const result = await this.formsModel.deleteOne({ _id: id }).exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException(`Formulário com ID "${id}" não encontrado.`);
    }

    return { message: `Formulário com ID "${id}" deletado com sucesso.` };
  }
}