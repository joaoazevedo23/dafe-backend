import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../models/user.schema'; // Importe UserDocument se o tiver
import { CreateUsersDTO } from './dtos/create-users.dto';
import { UpdateUsersDTO } from './dtos/update-users.dto';
import { validateId } from 'src/utils/validate-id';

@Injectable()
export class UsersService {
    constructor(
        // Correção 1: O tipo do modelo deve ser User (ou UserDocument), não UserSchema.
        @InjectModel(User.name) private readonly userModel: Model<User>,
    ) {}

    // Correção 2: Refatoração completa do método findAll.
    async findAll(curso?: string, modulo?: number): Promise<User[]> {
        // Objeto de query dinâmico para filtros
        const query = {};

        // Adiciona filtros apenas se eles forem fornecidos
        // Usa a "dot notation" para acessar os campos aninhados em 'studentDetails'
        if (curso) {
            query['studentDetails.curso'] = curso;
        }
        if (modulo) {
            query['studentDetails.modulo'] = modulo;
        }

        // Executa a busca com os filtros construídos dinamicamente
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
        // Lembrete: Seu DTO deve refletir a nova estrutura com 'studentDetails'
        const newUser = new this.userModel(createUsersDTO);
        return await newUser.save();
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