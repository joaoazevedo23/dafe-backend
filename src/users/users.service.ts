/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { User } from '../../models/user.schema';
import { Document } from 'mongoose';
type UserDocument = User & Document;
import { CreateUsersDTO } from './dtos/create-users.dto';
import { UpdateUsersDTO } from './dtos/update-users.dto';
import { validateId } from 'src/utils/decorators/validate-id';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

    async findAll(curso?: string, modulo?: number, role?: string): Promise<UserDocument[]> {
        const query: any = {};

        if (curso) {
            query['studentDetails.curso'] = curso;
        }
        if (modulo) {
            query['studentDetails.modulo'] = modulo;
        }
        if (role) {
            query['role'] = role;
        }

        return this.userModel.find(query).exec();
    }

    async findOne(id: string): Promise<UserDocument> {
        validateId(id);
        const user = await this.userModel.findById(id).exec();
        if (!user) {
            throw new NotFoundException(`Usuário com id ou slug "${idOrSlug}" não encontrado`);
        }
        return user;
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ email }).exec();
    }

    async create(createUsersDTO: CreateUsersDTO): Promise<UserDocument> {
        const newUser = new this.userModel(createUsersDTO);
        try {
            return await newUser.save();
        } catch (error: any) {
            if (error.code === 11000) {
                throw new NotFoundException('Já existe um usuário com este email ou nome de usuário.');
            }
            throw new NotFoundException('Erro ao criar usuário: ' + error.message);
        }
    }

    async update(id: string, updateUsersDTO: UpdateUsersDTO): Promise<UserDocument> {
        validateId(id);
        const user = await this.userModel.findByIdAndUpdate(id, updateUsersDTO, { new: true }).exec();
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
