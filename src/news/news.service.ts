import { Injectable, NotFoundException, UnauthorizedException,} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { News, NewsSchema } from '../../models/news.schema';
import { CreateNewsDTO } from './dtos/create-news.dto';
import { UpdateNewsDTO } from './dtos/update-news.dto';
import { validateId } from 'src/utils/decorators/validate-id';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News.name) private readonly newsModel: Model<NewsSchema>,
  ) {}

  // Encontra todas as notícias, opcionalmente filtrando por autor.
  async findAll(autorId?: string): Promise<News[]> {
    const query: any = {};
    if (autorId) {
      query.autor = autorId;
    }
    return this.newsModel
      .find(query)
      .sort({ createdAt: -1 }) // Ordena pelas mais recentes
      .populate('autor', 'nome usuario instituicao role') // Popula o campo 'autor'
      .exec();
  }

  // Encontra uma única notícia pelo ID.
  async findOne(id: string): Promise<News> {
    validateId(id); // Valida o formato do ID
    const news = await this.newsModel
      .findById(id)
      .populate('autor', 'nome usuario instituicao role')
      .exec();
    if (!news) {
      throw new NotFoundException(`Notícia com id ${id} não encontrada.`);
    }
    return news;
  }

  // Cria uma nova notícia.
  async create(createNewsDTO: CreateNewsDTO, autorId: string): Promise<News> {
    const newsCompleta = {
      ...createNewsDTO,
      autor: autorId,
    };
    const novaNoticia = new this.newsModel(newsCompleta);
    const noticiaSalva = await novaNoticia.save();

    return this.findOne(noticiaSalva._id.toString());
  }

  // Atualiza uma notícia existente.
  async update(id: string, updateNewsDTO: UpdateNewsDTO, userId: string): Promise<News> {
    validateId(id);

    // 1. Encontra e verifica se o documento existe.
    // Usamos findOne para evitar o overhead de um update se o documento não existir
    const noticiaExistente = await this.newsModel.findById(id).exec();
    if (!noticiaExistente) {
      throw new NotFoundException(`Notícia com id ${id} não encontrada.`);
    }

    // 2. Verifica se o usuário logado é o autor da notícia.
    if (noticiaExistente.autor.toString() !== userId) {
      throw new UnauthorizedException('Você não tem permissão para editar esta notícia.');
    }

    // 3. Executa o update e retorna o documento atualizado
    const noticiaAtualizada = await this.newsModel
      .findByIdAndUpdate(id, updateNewsDTO, { new: true })
      .populate('autor', 'nome usuario instituicao role')
      .exec();

    // 4. Verificação extra caso o findByIdAndUpdate não retorne um documento, embora
    // a verificação inicial já tenha garantido a existência.
    if (!noticiaAtualizada) {
        throw new NotFoundException(`Notícia com id ${id} não encontrada após a atualização.`);
    }

    return noticiaAtualizada;
  }

  // Deleta uma notícia.
  async delete(id: string, userId: string): Promise<{ message: string }> {
    validateId(id);
    const noticiaExistente = await this.newsModel.findById(id);

    if (!noticiaExistente) {
      throw new NotFoundException(`Notícia com id ${id} não encontrada.`);
    }

    // Verifica se o usuário logado é o autor da notícia.
    if (noticiaExistente.autor.toString() !== userId) {
      throw new UnauthorizedException('Você não tem permissão para deletar esta notícia.');
    }

    await this.newsModel.deleteOne({ _id: id }).exec();

    return { message: `Notícia com id ${id} foi deletada com sucesso.` };
  }
}