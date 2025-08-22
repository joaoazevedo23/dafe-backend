import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MongooseSchema, Document, Types } from 'mongoose';

export type FormsDocument = Forms & Document;

@Schema()
export class Opcao {
  @Prop({ required: true })
  label: string;

  @Prop()
  checked?: boolean;
}
export const OpcaoSchema = SchemaFactory.createForClass(Opcao);

@Schema({ discriminatorKey: 'tipo', _id: false })
export class Pergunta {
  @Prop({ required: true })
  titulo: string;

  @Prop({ required: true })
  enunciado: string;

  @Prop({ required: true, default: false })
  obrigatoria: boolean;
}
export const PerguntaSchema = SchemaFactory.createForClass(Pergunta);

@Schema()
export class PerguntaMultiplaEscolha extends Pergunta {
  @Prop({ required: true, type: [OpcaoSchema] })
  opcoes: Opcao[];
}
export const PerguntaMultiplaEscolhaSchema = SchemaFactory.createForClass(PerguntaMultiplaEscolha);

@Schema()
export class PerguntaEscolhaUnica extends Pergunta {
  @Prop({ required: true, type: [OpcaoSchema] })
  opcoes: Opcao[];
}
export const PerguntaEscolhaUnicaSchema = SchemaFactory.createForClass(PerguntaEscolhaUnica);

@Schema()
export class PerguntaDissertativa extends Pergunta {
  // Apenas a estrutura base é necessária
}
export const PerguntaDissertativaSchema = SchemaFactory.createForClass(PerguntaDissertativa);

// Adiciona os discriminadores no schema pai (PerguntaSchema)
PerguntaSchema.discriminator('MÚLTIPLA_ESCOLHA', PerguntaMultiplaEscolhaSchema);
PerguntaSchema.discriminator('ESCOLHA_ÚNICA', PerguntaEscolhaUnicaSchema);
PerguntaSchema.discriminator('DISSERTATIVA', PerguntaDissertativaSchema);

@Schema({ timestamps: true })
export class Forms {
  _id: Types.ObjectId;
  
  @Prop({ required: true, minlength: 3 })
  formTitulo: string;

  @Prop({ required: true, minlength: 3 })
  formDesc: string;

  @Prop({ type: [PerguntaSchema] })
  perguntas: Pergunta[];
}
export const FormsSchema = SchemaFactory.createForClass(Forms);