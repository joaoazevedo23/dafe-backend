import { Injectable, NotFoundException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { News, NewsSchema } from '../models/news.schema';
import { CreateNewsDTO } from './dtos/create-news.dto';
import { UpdateNewsDTO } from './dtos/update-news.dto';
import { validateId, isValidObjectId } from 'src/utils/decorators/validate-id';
import { UserRole } from 'src/models/user.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

const NEWS_FOLDER = 'noticias';

interface File {
    buffer: Buffer;
}

@Injectable()
export class NewsService {
    constructor(
        @InjectModel(News.name) private readonly newsModel: Model<NewsSchema>,
        private readonly cloudinaryService: CloudinaryService,
    ) { }

    private readonly userPopulateFields = 'nome email usuario role instituicao';

    async findAll(autorId?: string, userRole?: UserRole, cursoUser?: string, moduloUser?: number): Promise<News[]> {
        const conditions: any[] = [];

        if (userRole === UserRole.STUDENT && cursoUser && moduloUser) {

            const studentVisibilityFilter = {
                $or: [
                    // Notícias Gerais: Ambos os campos não existem
                    {
                        $and: [
                            { cursoDestino: { $exists: false } },
                            { moduloDestino: { $exists: false } }
                        ]
                    },
                    // Notícias Segmentadas para a turma
                    {
                        cursoDestino: cursoUser,
                        moduloDestino: moduloUser,
                    },
                ],
            } as any;

            conditions.push(studentVisibilityFilter);

        }

        if (autorId) {
            conditions.push({ autor: autorId });
        }

        let finalQuery: any = {};

        if (conditions.length > 0) {
            finalQuery = { $and: conditions };
        }

        return this.newsModel
            .find(finalQuery)
            .sort({ createdAt: -1 })
            .populate('autor', this.userPopulateFields)
            .exec();
    }

    async findOne(idOrSlug: string): Promise<News> {
        let news;

        if (isValidObjectId(idOrSlug)) {
            validateId(idOrSlug);
            news = await this.newsModel
                .findById(idOrSlug)
                .populate('autor', this.userPopulateFields)
                .exec();
        } else {
            news = await this.newsModel
                .findOne({ slugify: idOrSlug })
                .populate('autor', this.userPopulateFields)
                .exec();
        }

        if (!news) {
            throw new NotFoundException(`Notícia com identificador "${idOrSlug}" não encontrada.`);
        }
        return news;
    }

    async create(createNewsDTO: CreateNewsDTO, autorId: string, file?: File): Promise<News> {
        let imageUrl: string | undefined;
        let imageHash: string | undefined;

        if (file) {
            const uploadResult = await this.cloudinaryService.uploadImage(file as any, NEWS_FOLDER);
            imageUrl = uploadResult.secure_url;
            imageHash = uploadResult.public_id;
        }

        const newsCompleta = {
            ...createNewsDTO,
            autor: autorId,
            imageUrl: imageUrl, // Salva a URL
            imageHash: imageHash, // Salva o Hash
        };
        const novaNoticia = new this.newsModel(newsCompleta);
        const noticiaSalva = await novaNoticia.save();

        return this.findOne(noticiaSalva._id.toString());
    }

    async update(idOrSlug: string, updateNewsDTO: UpdateNewsDTO, userId: string, file?: File): Promise<News> {
        let noticiaExistente;

        if (isValidObjectId(idOrSlug)) {
            validateId(idOrSlug);
            noticiaExistente = await this.newsModel.findById(idOrSlug).exec();
        } else {
            noticiaExistente = await this.newsModel.findOne({ slugify: idOrSlug }).exec();
        }

        if (!noticiaExistente) {
            throw new NotFoundException(`Notícia com identificador "${idOrSlug}" não encontrada.`);
        }

        // Apenas o autor original pode editar
        if (noticiaExistente.autor.toString() !== userId) {
            throw new UnauthorizedException('Você não tem permissão para editar esta notícia.');
        }

        if (file) {
            // Upload do novo arquivo, sobrescrevendo URL e Hash no DTO
            const uploadResult = await this.cloudinaryService.uploadImage(file as any, NEWS_FOLDER);
            updateNewsDTO.imageUrl = uploadResult.secure_url;
            updateNewsDTO.imageHash = uploadResult.public_id;

        }

        let noticiaAtualizada;

        if (isValidObjectId(idOrSlug)) {
            noticiaAtualizada = await this.newsModel
                .findByIdAndUpdate(idOrSlug, updateNewsDTO, { new: true })
                .populate('autor', this.userPopulateFields)
                .exec();
        } else {
            noticiaAtualizada = await this.newsModel
                .findOneAndUpdate({ slugify: idOrSlug }, updateNewsDTO, { new: true })
                .populate('autor', this.userPopulateFields)
                .exec();
        }

        if (!noticiaAtualizada) {
            throw new NotFoundException(`Notícia com identificador "${idOrSlug}" não encontrada após a atualização.`);
        }

        return noticiaAtualizada;
    }

    async delete(idOrSlug: string, userId: string, userRole: UserRole): Promise<{ message: string }> {
        let noticiaExistente;

        if (isValidObjectId(idOrSlug)) {
            validateId(idOrSlug);
            noticiaExistente = await this.newsModel.findById(idOrSlug).exec();
        } else {
            noticiaExistente = await this.newsModel.findOne({ slugify: idOrSlug }).exec();
        }

        if (!noticiaExistente) {
            throw new NotFoundException(`Notícia com identificador "${idOrSlug}" não encontrada.`);
        }

        // Determina quem tem permissão
        const isOriginalAuthor = noticiaExistente.autor.toString() === userId;
        const isAdminOrManager = userRole === UserRole.ADMIN || userRole === UserRole.MANAGER;

        // Se não for o autor original E não for Admin/Manager, nega o acesso
        if (!isOriginalAuthor && !isAdminOrManager) {
            // Em ambientes de produção, ForbiddenException (403) é mais apropriado do que Unauthorized
            throw new ForbiddenException('Você não tem permissão para deletar esta notícia.');
        }

        if (isValidObjectId(idOrSlug)) {
            await this.newsModel.deleteOne({ _id: idOrSlug }).exec();
        } else {
            await this.newsModel.deleteOne({ slugify: idOrSlug }).exec();
        }

        return { message: `Notícia com identificador "${idOrSlug}" foi deletada com sucesso.` };
    }
}