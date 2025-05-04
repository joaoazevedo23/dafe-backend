import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostSchema } from '../../models/post.schema';
import { CreatePostDTO } from './dtos/create-post.dto';
import { UpdatePostDTO } from './dtos/update-post.dto';
import { validateId } from 'src/utils/validate-id';

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
  async create(createpostdto: CreatePostDTO): Promise<Post> {
      const novoPost = new this.postModel(createpostdto);
      return await novoPost.save();
  }
  
  // Atualizar post por ID
  async update(id: string, updatePostDTO: UpdatePostDTO): Promise<Post> {

    validateId(id); 

    const post = await this.postModel.findByIdAndUpdate(id, updatePostDTO, { new: true }).exec();
    if (!post) {
      throw new NotFoundException(`Post com id ${id} não encontrado`);
    }
    return post;
  }

  // Deletar por ID
  async delete(id: string): Promise<{ message: string }> {

    validateId(id); 

    const post = await this.postModel.findByIdAndDelete(id).exec();
    if (!post) {
      throw new NotFoundException(`Post com id ${id} não encontrado`);
    }
    return { message: `Post com id ${id} foi deletado com sucesso.` };
  }
}
