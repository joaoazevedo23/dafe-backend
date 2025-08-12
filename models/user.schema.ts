import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


export enum UserRole {
  STUDENT = 'student',
  PROFESSOR = 'professor',
  MANAGER = 'manager',
  ADMIN = 'admin',
}

@Schema({ _id: false }) 

class StudentDetails {

  @Prop({
    required: true,
    enum: [
      'Desenvolvimento de Sistemas',
      'Administração',
      'Logística',
      'Marketing',
      'Gestão de Recursos Humanos',
    ],
  })
  curso: string;

  @Prop({ required: true, enum: [1, 2, 3] })
  modulo: number;
}

export type UserSchema = User & Document;

@Schema({ timestamps: true }) // timestamps: true adiciona os campos createdAt e updatedAt
export class User {
  // --- Campos Comuns a Todos os Usuários ---
  @Prop({ required: true, trim: true })
  instituicao: string;

  @Prop({ required: [true, 'O nome é obrigatório'], trim: true })
  nome: string;

  @Prop({ required: [true, 'A senha é obrigatória'] })
  senha: string;

  @Prop({
    required: [true, 'O email é obrigatório'],
    unique: true,   // Garante que não haja emails duplicados
    lowercase: true, // Armazena o email sempre em minúsculas
    trim: true,
  })
  email: string;

  @Prop({
    required: [true, 'O nome de usuário é obrigatório'],
    unique: true,
    lowercase: true,
    trim: true,
  })
  usuario: string;

  @Prop({
    type: String, // O tipo no Mongoose é String
    required: true,
    enum: UserRole, // Valida se o valor está dentro do nosso enum
    default: UserRole.STUDENT, // Define um valor padrão se nenhum for fornecido
  })
  role: UserRole; // O tipo no TypeScript é o nosso enum

  // --- Campos Específicos de Cada Role ---

  @Prop({
    type: StudentDetails,
    // Este campo só será obrigatório se o 'role' for 'student'.
    // A validação pode ser feita na sua camada de serviço (lógica de negócio).
    required: false,
  })
  studentDetails?: StudentDetails; // O '?' torna o campo opcional no TypeScript

  // Futuramente, você pode adicionar outros detalhes aqui:
  // @Prop({ type: ProfessorDetails, required: false })
  // professorDetails?: ProfessorDetails;
}

export const UserSchema = SchemaFactory.createForClass(User);
