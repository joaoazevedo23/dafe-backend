import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FormDocument } from 'models/forms.schema';
import { Response, ResponseDocument } from 'models/response.schema';
import { Model } from 'mongoose';
import { CreateResponseDto } from './dto/create-response.dto';

@Injectable()
export class ResponsesService {
    constructor(
        @InjectModel('Response') private responseModel: Model<ResponseDocument>,
        @InjectModel('Form') private formModel: Model<FormDocument>,
    ) { }

    async submitResponse(createResponseDto: CreateResponseDto, userId: string): Promise<Response> {

        const form = await this.formModel.findOne({ $or: [{ _id: createResponseDto.formIdOrSlug }, { slug: createResponseDto.formIdOrSlug }] }).exec();
        if (!form) {
            throw new NotFoundException(`Formulário "${createResponseDto.formIdOrSlug}" não encontrado.`);
        }

        const responseCompleta = {
            form: form._id,
            autor: userId,
            respostas: createResponseDto.respostas,
        };
        const createdResponse = new this.responseModel(responseCompleta);
        return createdResponse.save();
    }

    async getResultsByFormId(formIdOrSlug: string): Promise<any> {
        // Buscar o Formulário (para obter todas as perguntas)
        const form = await this.formModel.findOne({ $or: [{ _id: formIdOrSlug }, { slug: formIdOrSlug }] }).exec();

        if (!form) {
            throw new NotFoundException(`Formulário com ID/Slug "${formIdOrSlug}" não encontrado.`);
        }

        // As respostas para este formulário
        const responses = await this.responseModel
            .find({ form: form._id })
            .populate('autor', 'nome email role')
            .exec();

        if (!responses.length) {
            return { formTitulo: form.formTitulo, results: [], summary: "Nenhuma resposta encontrada." };
        }

        // Mapear as perguntas do Formulário para acesso rápido pelo _id
        const questionsMap = new Map<string, any>();
        form.perguntas.forEach(q => {
            questionsMap.set(q._id.toString(), {
                titulo: q.titulo,
                enunciado: q.enunciado,
                tipo: q.tipo,
                opcoes: q.opcoes,
            });
        });

        // Mesclar perguntas e respostas
        const finalResults = responses.map(response => {
            const result: any = {
                responder: response.autor,
                dataResposta: response.createdAt,
                respostasDetalhadas: []
            };

            response.respostas.forEach(answer => {
                const questionContext = questionsMap.get(answer.questionId);

                if (questionContext) {
                    result.respostasDetalhadas.push({
                        ...questionContext,
                        respostaSubmetida: answer.submittedAnswer,
                    });
                }
            });

            return result;
        });

        return {
            formId: form._id,
            formTitulo: form.formTitulo,
            totalRespostas: responses.length,
            results: finalResults,
        };
    }
}