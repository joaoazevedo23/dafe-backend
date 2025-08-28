import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Respostas, RespostasDocument } from '../../models/answer.schema';
import { Forms, FormsDocument } from '../../models/forms.schema';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { validateId } from 'src/utils/decorators/validate-id';

@Injectable()
export class AnswersService {
  constructor(
    @InjectModel(Respostas.name) private readonly answerModel: Model<RespostasDocument>,
    @InjectModel(Forms.name) private readonly formModel: Model<FormsDocument>,
  ) {}

  async create(createAnswerDto: CreateAnswerDto, autorId: string): Promise<Respostas> {
    const { formulario } = createAnswerDto;

    // 1. Verifica se o formulário existe
    validateId(formulario);
    const formExists = await this.formModel.findById(formulario).exec();
    if (!formExists) {
      throw new NotFoundException(`Formulário com ID "${formulario}" não encontrado.`);
    }

    // 2. Cria a resposta
    const answerData = {
      ...createAnswerDto,
      autor: autorId,
    };
    const newAnswer = new this.answerModel(answerData);
    return await newAnswer.save();
  }

  // Busca todas as respostas de um formulário específico
  async findAllByForm(formId: string): Promise<Respostas[]> {
    validateId(formId);
    return this.answerModel
      .find({ formulario: formId })
      .populate('autor', 'nome usuario role') // Popula com dados do autor
      .exec();
  }
}