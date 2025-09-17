import { Options } from "@nestjs/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MogooseSchema, Types } from 'mongoose';

// opções das perguntas
@Schema({ _id: false }) // para nao criar IDs para cada opção
export class Option extends Document {
    @Prop({ required: true })
    label: string;

    @Prop({ required: false }) // só para multipla escolha; opcional.
    checked?: boolean;
}

export const OptionSchema = SchemaFactory.createForClass(Option);

// subdocumento para as perguntas
@Schema({_id: false})
export class Question extends Document {
    @Prop({
        type: String,
        required: true,
        enum: ['MÚTLIPLA_ESCOLHA', 'ESCOLHA_ÚNICA', 'DISSERTATIVA'],
    })
    tipo: string;

    @Prop({ required: true })
    título: string;

    @Prop({ required: true })
    enunciado: string;

    @Prop({ required: false, default: false })
    obrigatoria?: boolean;

    @Prop({ type: [OptionSchema], required: false })
    opcoes?: Option[];

    @Prop({ required: false })
    resposta?: string | number;
}
export const QuestionSchema = SchemaFactory.createForClass(Question);

// schema formulario
export type FormsDocument = Forms & Document;

@Schema({ timestamps: true }) // o true adiciona createdAt e updatedAt
export class Forms {
    _id: Types.ObjectId;

    @Prop ({ required: true, minlength: 3 })
    formTitulo: string;

    @Prop({ required: true, minlength: 3 })
    formDesc: string;

    @Prop({ type: [QuestionSchema], required: false, default: [ ]})
    perguntas?: Question[];

    // pode ser adicionado campo para o autor:
    // @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    // autor: User;
}

export const FormsSchema = SchemaFactory.createForClass(Forms);
