import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { User } from '../models/user.schema'; 
import { CreateUsersDTO } from './dtos/create-users.dto';
import { UpdateUsersDTO } from './dtos/update-users.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service'; 

// Garante que o arquivo tenha os dados binários
interface File {
    buffer: Buffer; 
}

// Pasta de destino das fotos de perfil
const USER_PROFILE_FOLDER = 'perfil_usuario'; 

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        private readonly cloudinaryService: CloudinaryService,
    ) {}

    async findAll(curso?: string, modulo?: number, role?: string): Promise<User[]> {
        const query: any = {};

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

    async findByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({ email }).exec();
    }

    async create(createUsersDTO: CreateUsersDTO, file?: File): Promise<User> {
        let imageUrl: string | undefined;
        let imageHash: string | undefined; 

        if (file) {
            // Chama o upload passando o arquivo e a pasta de destino
            const uploadResult = await this.cloudinaryService.uploadImage(file as any, USER_PROFILE_FOLDER); 
            imageUrl = uploadResult.secure_url; 
            imageHash = uploadResult.public_id; // Salva o ID público do Cloudinary
        }

        const UsersCompleto = {
            ...createUsersDTO,
            imageUrl: imageUrl,
            imageHash: imageHash, 
        };

        try {
            const createdUser = await this.userModel.create(UsersCompleto);
            return createdUser;

        } catch (error) {
            if ((error as any).code === 11000) {
                throw new NotFoundException('Já existe um usuário com este email ou nome de usuário.');
            }
            throw new NotFoundException('Erro ao criar usuário: ' + (error as Error).message);
        }
    }

    async update(idOrSlug: string, updateUsersDTO: UpdateUsersDTO, file?: File): Promise<User> {

        if (file) {
            try {
                const uploadResult = await this.cloudinaryService.uploadImage(file as any, USER_PROFILE_FOLDER);
                
                updateUsersDTO.imageUrl = uploadResult.secure_url;
                updateUsersDTO.imageHash = uploadResult.public_id; // Salva o novo hash/ID
                                
            } catch (error) {
                throw new Error(`Falha no upload para o Cloudinary: ${(error as Error).message}`)
            }
        }

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