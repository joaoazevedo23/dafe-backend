import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostSchema } from './schemas/post.schema';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostSchema>,
  ) {}

  // Buscar todos os posts ou filtrar por tópico
  async findAll(topico?: string): Promise<Post[]> {
    if (topico) {
        return this.postModel.find({ topico: topico }).exec();
    }
    return this.postModel.find().exec();
  }

  // Buscar um post por ID
  async findOne(id: string): Promise<Post> {
    const post = await this.postModel.findById(id).exec();
    if (!post) {
      throw new NotFoundException(`Post com id ${id} não encontrado`);
    }
    return post;
  }

  // Criar novo post
  async create(postData: Partial<Post>): Promise<Post> {
    console.log('Recebido:', postData);
    try {
      const novoPost = new this.postModel(postData);
      return await novoPost.save();
    } catch (err) {
      console.error('Erro ao salvar post:', err);
      throw err;
    }
  }
  

  // Deletar por ID
  async delete(id: string): Promise<{ message: string }> {
    const post = await this.postModel.findByIdAndDelete(id).exec();
    if (!post) {
      throw new NotFoundException(`Post com id ${id} não encontrado`);
    }
    return { message: `Post com id ${id} foi deletado com sucesso.` };
  }
}
