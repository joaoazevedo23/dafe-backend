import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student, StudentSchema } from '../../models/student.schema';
import { CreateStudentsDTO } from './dtos/create-students.dto';
import { UpdateStudentsDTO } from './dtos/update-students.dto';
import { validateId } from 'src/utils/validate-id';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';


@Injectable()
export class StudentsService {

    constructor(
        @InjectModel(Student.name) private readonly studentSchema: Model<StudentSchema>,
    ) { }

    async findAll(curso?: string, modulo?: number): Promise<Student[]> {
        if (curso && modulo) {
            return this.studentSchema.find({ curso: curso, modulo: modulo }).exec();
        }
        else if (curso) {
            return this.studentSchema.find({ curso: curso }).exec();
        }
        else if (modulo) {
            return this.studentSchema.find({ modulo: modulo }).exec();
        }
        return this.studentSchema.find().exec();

    }

    async findOne(id: string): Promise<Student> {
        validateId(id); // Valida o ID antes de fazer a busca
        const student = await this.studentSchema.findById(id).exec();
        if (!student) {
            throw new NotFoundException(`Estudante com id: ${id} não encontrado`);
        }
        return student;
    }

    async create(createStudentsDTO: CreateStudentsDTO): Promise<Student> {
        const novoStudent = new this.studentSchema(createStudentsDTO);
        return await novoStudent.save();
    }

    async update(id: string, updateStudentsDTO: UpdateStudentsDTO): Promise<Student> {
        validateId(id); // Valida o ID antes de fazer a busca
        const student = await this.studentSchema.findByIdAndUpdate(id, updateStudentsDTO, { new: true }).exec();
        if (!student) {
            throw new NotFoundException(`Estudante com id: ${id} não encontrado`);
        }
        return student;
    }

    async delete(id: string): Promise<{ message: string }> {
        validateId(id); // Valida o ID antes de fazer a busca
        const student = await this.studentSchema.findByIdAndDelete(id).exec();
        if (!student) {
            throw new NotFoundException(`Estudante com id ${id} não encontrado`);
        }
        return { message: `Estudante com id: ${id} deletado com sucesso` };
    }   

}