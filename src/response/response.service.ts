import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Response, ResponseDocument } from '../../models/response.schema';

@Injectable()
export class ResponseService {
  constructor(@InjectModel(Response.name) private responseModel: Model<ResponseDocument>) { }

  private readonly userPopulateFields = 'nome email usuario role instituicao';

  async create(formId: string, autorId: string, respostas: (number | number[] | string)[]) {
    const response = new this.responseModel({
      form: new Types.ObjectId(formId),
      autor: autorId, 
      respostas: respostas.map(r => r ?? []),
    });

    const responseSalva = await response.save();

    return this.findOne((responseSalva._id as any).toString());
  }

  async findOne(id: string) {
    return this.responseModel
      .findById(id)
      .populate('autor', this.userPopulateFields)
      .exec();
  }

  async findAll(formId: string) {
    return this.responseModel
      .find({ form: formId })
      .populate('autor', this.userPopulateFields)
      .exec();
  }
}