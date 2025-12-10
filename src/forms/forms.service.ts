import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFormDto } from './dto/create-form.dto';
import { Form, FormDocument } from 'src/models/forms.schema';
import { isValidObjectId, validateId } from 'src/utils/decorators/validate-id';
import { UserRole } from 'src/models/user.schema';

@Injectable()
export class FormsService {
  constructor(@InjectModel(Form.name) private formModel: Model<FormDocument>) {}
  private readonly userPopulateFields = 'nome email usuario role instituicao';

  async create(createFormDto: CreateFormDto, userId: string): Promise<Form> {
    const formCompleto = {
      ...createFormDto,
      autor: userId,
      responsesCount: createFormDto.responsesCount ?? 0,
      perguntas: createFormDto.perguntas?.map(p => ({
        ...p,
        resposta: p.resposta ?? null,
        opcoes: p.opcoes || [],
      })) || [],
    };

    const createdForm = new this.formModel(formCompleto);
    const formSave = await createdForm.save();
    return this.findOne((formSave._id as any).toString());
  }

  async findAll(): Promise<Form[]> {
    const forms = await this.formModel
      .find()
      .populate('autor', this.userPopulateFields)
      .exec();

    return forms.map(form => ({
      ...form.toObject(),
      responsesCount: form.responsesCount ?? 0,
      perguntas: form.perguntas.map(p => ({
        ...p,
        resposta: p.resposta ?? null,
        opcoes: p.opcoes || [],
      })),
    }));
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

    if (!form)
      throw new NotFoundException(`Formulário com identificador "${idOrSlug}" não encontrado`);

    return {
      ...form.toObject(),
      responsesCount: form.responsesCount ?? 0,
      perguntas: form.perguntas.map(p => ({
        ...p,
        resposta: p.resposta ?? null,
        opcoes: p.opcoes || [],
      })),
    };
  }

  async incrementResponsesCount(formId: string): Promise<Form> {
    validateId(formId);

    const updatedForm = await this.formModel
      .findByIdAndUpdate(
        formId,
        { $inc: { responsesCount: 1 } },
        { new: true }
      )
      .populate('autor', this.userPopulateFields)
      .exec();

    if (!updatedForm) {
      throw new NotFoundException(`Formulário com id ${formId} não encontrado`);
    }

    return {
      ...updatedForm.toObject(),
      responsesCount: updatedForm.responsesCount ?? 0,
      perguntas: updatedForm.perguntas.map(p => ({
        ...p,
        resposta: p.resposta ?? null,
        opcoes: p.opcoes || [],
      })),
    };
  }


  async deleteOne(id: string, userId: string, userRole: UserRole): Promise<void> {
    const form = await this.formModel.findById(id).exec();
    if (!form) {
      throw new NotFoundException(`Formulário com id ${id} não encontrado`);
    }

    const isOwner = form.autor.toString() === userId;
    const isManagerOrAdmin = userRole === UserRole.MANAGER || userRole === UserRole.ADMIN;

    if (!isOwner && !isManagerOrAdmin) {
      throw new ForbiddenException('Você só pode deletar formulários criados por você.');
    }

    await form.deleteOne(); 
  }
}
