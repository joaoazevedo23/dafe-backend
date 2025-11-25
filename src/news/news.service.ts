import { Injectable, NotFoundException, UnauthorizedException, } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { News, NewsSchema } from '../../models/news.schema';
import { CreateNewsDTO } from './dtos/create-news.dto';
import { UpdateNewsDTO } from './dtos/update-news.dto';
import { validateId, isValidObjectId } from 'src/utils/decorators/validate-id';
import { UserRole } from 'models/user.schema';

@Injectable()
export class NewsService {
    constructor(
        @InjectModel(News.name) private readonly newsModel: Model<NewsSchema>,
    ) { }

    async findAll( autorId?: string, userRole?: UserRole, cursoUser?: string, moduloUser?: number): Promise<News[]> {
    const conditions: any[] = [];

    if (userRole === UserRole.STUDENT && cursoUser && moduloUser) {
        
        const studentVisibilityFilter = {
            $or: [
                { 
                    $and: [
                        { cursoDestino: { $exists: false } },
                        { moduloDestino: { $exists: false } }
                    ]
                },
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
        .populate('autor', 'nome usuario instituicao role')
        .exec();
}

    async findOne(idOrSlug: string): Promise<News> {
        let news;

        if (isValidObjectId(idOrSlug)) {
            validateId(idOrSlug);
            news = await this.newsModel
                .findById(idOrSlug)
                .populate('autor', 'nome usuario instituicao role')
                .exec();
        } else {
            news = await this.newsModel
                .findOne({ slug: idOrSlug })
                .populate('autor', 'nome usuario instituicao role')
                .exec();
        }

        if (!news) {
            throw new NotFoundException(`Notícia com identificador "${idOrSlug}" não encontrada.`);
        }
        return news;
    }

    async create(createNewsDTO: CreateNewsDTO, autorId: string): Promise<News> {
        const newsCompleta = {
            ...createNewsDTO,
            autor: autorId,
        };
        const novaNoticia = new this.newsModel(newsCompleta);
        const noticiaSalva = await novaNoticia.save();

        return this.findOne(noticiaSalva._id.toString());
    }

    async update(idOrSlug: string, updateNewsDTO: UpdateNewsDTO, userId: string): Promise<News> {
        let noticiaExistente;

        if (isValidObjectId(idOrSlug)) {
            validateId(idOrSlug);
            noticiaExistente = await this.newsModel.findById(idOrSlug).exec();
        } else {
            noticiaExistente = await this.newsModel.findOne({ slug: idOrSlug }).exec();
        }

        if (!noticiaExistente) {
            throw new NotFoundException(`Notícia com identificador "${idOrSlug}" não encontrada.`);
        }

        if (noticiaExistente.autor.toString() !== userId) {
            throw new UnauthorizedException('Você não tem permissão para editar esta notícia.');
        }

        let noticiaAtualizada;

        if (isValidObjectId(idOrSlug)) {
            noticiaAtualizada = await this.newsModel
                .findByIdAndUpdate(idOrSlug, updateNewsDTO, { new: true })
                .populate('autor', 'nome usuario instituicao role')
                .exec();
        } else {
            noticiaAtualizada = await this.newsModel
                .findOneAndUpdate({ slug: idOrSlug }, updateNewsDTO, { new: true })
                .populate('autor', 'nome usuario instituicao role')
                .exec();
        }

        if (!noticiaAtualizada) {
            throw new NotFoundException(`Notícia com identificador "${idOrSlug}" não encontrada após a atualização.`);
        }

        return noticiaAtualizada;
    }

    async delete(idOrSlug: string, userId: string): Promise<{ message: string }> {
        let noticiaExistente;

        if (isValidObjectId(idOrSlug)) {
            validateId(idOrSlug);
            noticiaExistente = await this.newsModel.findById(idOrSlug).exec();
        } else {
            noticiaExistente = await this.newsModel.findOne({ slug: idOrSlug }).exec();
        }

        if (!noticiaExistente) {
            throw new NotFoundException(`Notícia com identificador "${idOrSlug}" não encontrada.`);
        }

        if (noticiaExistente.autor.toString() !== userId) {
            throw new UnauthorizedException('Você não tem permissão para deletar esta notícia.');
        }

        if (isValidObjectId(idOrSlug)) {
            await this.newsModel.deleteOne({ _id: idOrSlug }).exec();
        } else {
            await this.newsModel.deleteOne({ slug: idOrSlug }).exec();
        }

        return { message: `Notícia com identificador "${idOrSlug}" foi deletada com sucesso.` };
    }
}