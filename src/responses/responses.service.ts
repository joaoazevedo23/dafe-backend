import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FormDocument } from 'src/models/forms.schema';
import { Response, ResponseDocument } from 'src/models/response.schema';
import { Model } from 'mongoose';
import { CreateResponseDto } from './dto/create-response.dto';
import { FormsService } from 'src/forms/forms.service';

@Injectable()
export class ResponsesService {
    constructor(
        @InjectModel('Response') private responseModel: Model<ResponseDocument>,
        @InjectModel('Form') private formModel: Model<FormDocument>,
        private readonly formsService: FormsService,
    ) {}

    async submitResponse(createResponseDto: CreateResponseDto, userId: string): Promise<Response> {
        const form = await this.formModel.findOne({
            $or: [{ _id: createResponseDto.formIdOrSlug }, { slug: createResponseDto.formIdOrSlug }]
        });

        if (!form) {
            throw new NotFoundException(`Formulário "${createResponseDto.formIdOrSlug}" não encontrado.`);
        }

        const existingResponse = await this.responseModel.findOne({
            form: form._id,
            autor: userId
        });

        if (existingResponse) {
            throw new NotFoundException("Você já respondeu esse formulário.");
        }

        const normalizedAnswers = createResponseDto.respostas.map(r => ({
            questionId: r.questionId,
            submittedAnswer:
                r.submittedAnswer === undefined ? null : r.submittedAnswer
        }));

        const responseCompleta = {
            form: form._id,
            autor: userId,
            respostas: normalizedAnswers,
        };

        const createdResponse = new this.responseModel(responseCompleta);
        await this.formsService.incrementResponsesCount(form._id.toString());

        return createdResponse.save();
    }

    async hasUserResponded(formId: string, userId: string) {
        const form = await this.formModel.findOne({ _id: formId });

        if (!form) return { answered: false };

        const existing = await this.responseModel.findOne({
            form: form._id,
            autor: userId
        });

        return { answered: !!existing };
    }

    async getResultsByFormId(formIdOrSlug: string) {
        const form = await this.formModel
            .findOne({ $or: [{ _id: formIdOrSlug }, { slug: formIdOrSlug }] })
            .populate('autor', 'nome email usuario role instituicao');

        if (!form) {
            throw new NotFoundException(`Formulário "${formIdOrSlug}" não encontrado.`);
        }

        const responses = await this.responseModel
            .find({ form: form._id })
            .populate('autor', 'nome email role');

        if (!responses.length) {
            return {
                formTitulo: form.formTitulo,
                autorFormulario: form.autor,
                results: [],
                summary: "Nenhuma resposta encontrada."
            };
        }

        const questionsMap = new Map<string, any>();
        form.perguntas.forEach(q => {
            questionsMap.set(q._id.toString(), {
                titulo: q.titulo,
                enunciado: q.enunciado,
                tipo: q.tipo,
                opcoes: q.opcoes
            });
        });

        const finalResults = responses.map(response => ({
            responder: response.autor,
            dataResposta: response.createdAt,
            respostasDetalhadas: response.respostas.map(answer => ({
                ...questionsMap.get(answer.questionId),
                respostaSubmetida: answer.submittedAnswer
            }))
        }));

        return {
            formId: form._id,
            formTitulo: form.formTitulo,
            autorFormulario: form.autor,
            totalRespostas: responses.length,
            results: finalResults,
        };
    }

    async getAnsweredFormsIds(userId: string): Promise<string[]> {
        const answered = await this.responseModel
            .find({ autor: userId })
            .select('form')
            .lean();

        return answered.map(r => r.form.toString());
    }
}
