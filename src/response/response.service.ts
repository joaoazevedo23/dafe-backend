import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Response, ResponseDocument } from '../../models/response.schema';

@Injectable()
export class ResponseService {
  constructor(@InjectModel(Response.name) private responseModel: Model<ResponseDocument>) {}

  async create(formId: string, usuario: string, respostas: (string | number | number[])[], data: { usuario: string; respostas: (number | number[] | string)[]; }) {
    const response = new this.responseModel({
      form: new Types.ObjectId(formId),
      usuario: data.usuario,
      respostas: data.respostas.map(r => r ?? []), // evita null
    });
    return response.save();
  }
}
