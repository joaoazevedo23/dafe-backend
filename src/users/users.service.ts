import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { User } from '../../models/user.schema'; 
import { CreateUsersDTO } from './dtos/create-users.dto';
import { UpdateUsersDTO } from './dtos/update-users.dto';

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

    async findOne(idOrSlug: string): Promise<User> {
        let user: User | null;

        if (isValidObjectId(idOrSlug)) {
            user = await this.userModel.findById(idOrSlug).exec();
        } else {
            user = await this.userModel.findOne({ slug: idOrSlug }).exec();
        }

        if (!user) {
            throw new NotFoundException(`Usuário com id ou slug "${idOrSlug}" não encontrado`);
        }
        return user;
    }

    async create(createUsersDTO: CreateUsersDTO): Promise<User> {
        try {
            const createdUser = await this.userModel.create(createUsersDTO);
            return createdUser;
        } catch (error) {
            if (error.code === 11000) {
                throw new NotFoundException('Já existe um usuário com este email ou nome de usuário.');
            }
            throw new NotFoundException('Erro ao criar usuário: ' + error.message);
        }
    }

    async update(idOrSlug: string, updateUsersDTO: UpdateUsersDTO): Promise<User> {
        let user: User | null;

        if (isValidObjectId(idOrSlug)) {
            user = await this.userModel.findByIdAndUpdate(idOrSlug, updateUsersDTO, { new: true }).exec();
        } else {
            user = await this.userModel.findOneAndUpdate({ slug: idOrSlug }, updateUsersDTO, { new: true }).exec();
        }

        if (!user) {
            throw new NotFoundException(`Usuário com id ou slug "${idOrSlug}" não encontrado`);
        }
        return user;
    }

    async delete(idOrSlug: string): Promise<{ message: string }> {
        let user: User | null;

        if (isValidObjectId(idOrSlug)) {
            user = await this.userModel.findByIdAndDelete(idOrSlug).exec();
        } else {
            user = await this.userModel.findOneAndDelete({ slug: idOrSlug }).exec();
        }

        if (!user) {
            throw new NotFoundException(`Usuário com id ou slug "${idOrSlug}" não encontrado`);
        }
        return { message: `Usuário com id ou slug "${idOrSlug}" deletado com sucesso` };
    }
}
