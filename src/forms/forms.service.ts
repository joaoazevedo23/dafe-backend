import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFormDto } from './dto/create-form.dto';
import { Form, FormDocument } from 'src/models/forms.schema';
import { isValidObjectId, validateId } from 'src/utils/decorators/validate-id';
import { UserRole } from 'src/models/user.schema';

@Injectable()
export class FormsService {
  constructor(@InjectModel(Form.name) private formModel: Model<FormDocument>) { }
  private readonly userPopulateFields = 'nome email usuario role instituicao';

  async create(createFormDto: CreateFormDto, userId: string): Promise<Form> {
    const formCompleto = {
      ...createFormDto,
      autor: userId,
    };
    const createdForm = new this.formModel(formCompleto);
    const formSave = await createdForm.save();
    return this.findOne((formSave._id as any).toString());
  }

  async findAll(): Promise<Form[]> {
    return this.formModel
      .find()
      .populate('autor', this.userPopulateFields)
      .exec();
  }

  async findOne(idOrSlug: string): Promise<Form> {
    let query: any;
    if (isValidObjectId(idOrSlug)) {
      query = this.formModel.findById(idOrSlug);
    } else {
      query = this.formModel.findOne({ slug: idOrSlug });
    }
    const form = await query
      .populate('autor', this.userPopulateFields)
      .exec();
    if (!form) throw new NotFoundException(`Formulário com identificador "${idOrSlug}" não encontrado`);
    return form;
  }

  async incrementResponsesCount(formId: string): Promise<Form> {
    validateId(formId);
    const updatedForm = await this.formModel
      .findByIdAndUpdate(formId, { $inc: { responsesCount: 1 } }, { new: true })
      .populate('autor', this.userPopulateFields)
      .exec();

    if (!updatedForm) {
      throw new NotFoundException(`Formulário  com id ${formId} não encontrado`);
    }
    return updatedForm;
  }


  async deleteOne(id: string, userId: string, userRole: UserRole): Promise<void> {

    // 1. Busca o formulário
    const form = await this.formModel.findById(id).exec();
    if (!form) {
      throw new NotFoundException(`Formulário com id ${id} não encontrado`);
    }

    // 2. Regras de Permissão
    const isOwner = form.autor.toString() === userId;
    const isManagerOrAdmin = userRole === UserRole.MANAGER || userRole === UserRole.ADMIN;

    if (!isOwner && !isManagerOrAdmin) {
      throw new ForbiddenException('Você só pode deletar formulários criados por você.');
    }

    // 3. Executa a deleção para ATIVAR O HOOK
    // A deleção do documento (instância) dispara o hook 'pre'
    await form.deleteOne();
  }
}