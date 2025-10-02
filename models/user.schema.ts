import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import slug from 'slug';


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
    enum: ['Desenvolvimento de Sistemas', 'Administração', 'Logística', 'Marketing', 'Gestão de Recursos Humanos'],
  })
  curso: string;

  @Prop({ required: true, enum: [1, 2, 3] })
  modulo: number;
}

class ProfessorDetails {

  @Prop({ required: [true, 'A matrícula é obrigatória'], unique: true })
  matricula: number;

  @Prop({ required: true, enum: ["Matutino", "Vespertino", "Noturno"] })
  periodo: string;
}

export type UserSchema = User & Document;

@Schema({ timestamps: true })
export class User {
  [x: string]: any;
  // Campos Gerais de Todos os Usuários

  @Prop({ required: [true, 'O nome é obrigatório'], trim: true })
  nome: string;

  @Prop({
    required: [true, 'O nome de usuário é obrigatório'],
    unique: true,
    lowercase: true,
    trim: true,
  })
  usuario: string;

  @Prop({
    required: [true, 'O email é obrigatório'],
    unique: true,
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop({ required: [true, 'A senha é obrigatória'] })
  senha: string;

  @Prop({ required: true, trim: true, enum: ["Etec de Guarulhos"] })
  instituicao: string;

  @Prop({
    type: String,
    required: true,
    enum: UserRole,
    default: UserRole.STUDENT,
  })
  role: UserRole;

  // Campos Específicos de Cada Role

  @Prop({
    type: StudentDetails,
    required: false,
  })
  studentDetails?: StudentDetails;

  @Prop({
    type: ProfessorDetails,
    required: false
  })
  professorDetails?: ProfessorDetails;

  @Prop({ unique: true }) /* Campo slug */
  slug: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function (next) {
  if (this.isNew || this.isModified('usuario')) {
    this.slug = slug(this.usuario, { lower: true });
  }
  next();
});
