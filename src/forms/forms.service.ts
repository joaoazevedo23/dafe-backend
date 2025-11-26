import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFormDto } from './dto/create-form.dto';
import { Form, FormDocument } from 'models/forms.schema';
import { isValidObjectId } from 'src/utils/decorators/validate-id'; // Assumindo o import

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

  async deleteOne(id: string): Promise<void> {
    const result = await this.formModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Formulário com id ${id} não encontrado`);
  }
}