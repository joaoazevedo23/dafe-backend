import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import slugify from 'slugify';


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

@Schema({ _id: false })
class ProfessorDetails {
  @Prop({ required: [true, 'A matrícula é obrigatória'], unique: true })
  matricula: number;

  @Prop({ required: true, enum: ["Matutino", "Vespertino", "Noturno"] })
  periodo: string;
}

export type UserSchema = User & Document;

@Schema({ timestamps: true })
export class User {
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

  @Prop({ required: false })
  imageUrl?: string;

  @Prop({ required: false })
  imageHash?: string;

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

  @Prop({ unique: true })
  slug: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  await this.model('Post').deleteMany({ autor: this._id });
  console.log(`Usuário com id ${this._id} deletado, removendo posts associados.`);
  next();
});

UserSchema.pre('save', function (next) {
  if (this.isNew || this.isModified('usuario')) {
    const baseSlug = slugify(this.usuario, { lower: true });
    const uniqueSuffix = Date.now().toString(36);
    this.slug = `${baseSlug}-${uniqueSuffix}`;
  }
  next();
});