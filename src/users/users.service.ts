import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserSchema } from '../../models/user.schema'; 
import { CreateUsersDTO } from './dtos/create-users.dto';
import { UpdateUsersDTO } from './dtos/update-users.dto';
import { validateId } from 'src/utils/decorators/validate-id';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

    async findAll(curso?: string, modulo?: number, role?: string): Promise<User[]> {
        const query = {};

        if (curso) {
            query['studentDetails.curso'] = curso;
        }
        if (modulo) {
            query['studentDetails.modulo'] = modulo;
        }
        if(role){
            query['role'] = role;
        }

        return this.userModel.find(query).exec();
    }

    async findOne(id: string): Promise<User> {
        validateId(id);
        const user = await this.userModel.findById(id).exec();
        if (!user) {
            // Correção 3: Mensagem de erro generalizada
            throw new NotFoundException(`Usuário com id: ${id} não encontrado`);
        }
        return user;
    }

    async create(createUsersDTO: CreateUsersDTO): Promise<User> {
        const newUser = new this.userModel(createUsersDTO);
        try {
            return await newUser.save();
        } catch (error) {
            // Correção 4: Tratamento de erro para duplicidade de email ou usuário
            if (error.code === 11000) {
                throw new NotFoundException('Já existe um usuário com este email ou nome de usuário.');
            }
            throw new NotFoundException('Erro ao criar usuário: ' + error.message);
        }
    }

    async update(id: string, updateUsersDTO: UpdateUsersDTO): Promise<User> {
        validateId(id);
        const user = await this.userModel.findByIdAndUpdate(id, updateUsersDTO, { new: true }).exec();
        if (!user) {
            throw new NotFoundException(`Usuário com id: ${id} não encontrado`);
        }
        return user;
    }

    async delete(id: string): Promise<{ message: string }> {
        validateId(id);
        const user = await this.userModel.findByIdAndDelete(id).exec();
        if (!user) {
            throw new NotFoundException(`Usuário com id: ${id} não encontrado`);
        }
        return { message: `Usuário com id: ${id} deletado com sucesso` };
    }
}