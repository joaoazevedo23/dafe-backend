import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Forms, FormsDocument } from '../../models/forms.schema';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { validateId, isValidObjectId  } from '../utils/decorators/validate-id';
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

  async findOne(idOrSlug: string): Promise<Forms> {
    let form;

    if (isValidObjectId(idOrSlug)) {
      // Se for id válido, usa findById (com validação estrita)
      validateId(idOrSlug);
      form = await this.formsModel.findById(idOrSlug).exec();
    } else {
      // Senão, procura pelo slug
      form = await this.formsModel.findOne({ slug: idOrSlug }).exec();
    }

    if (!form) {
      throw new NotFoundException(`Formulário com identificador "${idOrSlug}" não encontrado.`);
    }
    return form;
  }

  async update(idOrSlug: string, updateFormDto: UpdateFormDto, user: UserPayload): Promise<Forms> {
    let updatedForm;

    // Permissão
    if (user.role !== UserRole.PROFESSOR && user.role !== UserRole.MANAGER) {
      throw new NotFoundException('Você não tem permissão para editar este formulário.');
    }

    if (isValidObjectId(idOrSlug)) {
      validateId(idOrSlug);
      updatedForm = await this.formsModel.findByIdAndUpdate(idOrSlug, updateFormDto, { new: true }).exec();
    } else {
      updatedForm = await this.formsModel.findOneAndUpdate({ slug: idOrSlug }, updateFormDto, { new: true }).exec();
    }

    if (!updatedForm) {
      throw new NotFoundException(`Formulário com identificador "${idOrSlug}" não encontrado.`);
    }
    return updatedForm;
  }

  async remove(idOrSlug: string, user: UserPayload): Promise<{ message: string }> {
    // Permissão
    if (user.role !== UserRole.PROFESSOR && user.role !== UserRole.MANAGER) {
      throw new NotFoundException('Você não tem permissão para deletar este formulário.');
    }

    let result;

    if (isValidObjectId(idOrSlug)) {
      validateId(idOrSlug);
      result = await this.formsModel.deleteOne({ _id: idOrSlug }).exec();
    } else {
      result = await this.formsModel.deleteOne({ slug: idOrSlug }).exec();
    }

    if (result.deletedCount === 0) {
      throw new NotFoundException(`Formulário com identificador "${idOrSlug}" não encontrado.`);
    }

    return { message: `Formulário com identificador "${idOrSlug}" deletado com sucesso.` };
  }
}
