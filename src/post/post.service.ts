// src/posts/post.service.ts

import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostSchema} from '../../models/post.schema'; // Certifique-se que o caminho está correto
import { CreatePostDTO } from './dtos/create-post.dto';
import { UpdatePostDTO } from './dtos/update-post.dto';
import { validateId } from 'src/utils/validate-id'; // Certifique-se que o caminho está correto

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostSchema>,
  ) {}

  async findAll(topico?: string): Promise<Post[]> {
    const query = topico ? { topico: topico } : {};
    return this.postModel
      .find(query)
      .sort({ createdAt: -1 })
      .populate('autor', 'nome email usuario instituicao curso modulo') // 👈 ALTERAÇÃO AQUI
      .exec();
  }

  async findOne(id: string): Promise<Post> {
    validateId(id);
    const post = await this.postModel
      .findById(id)
      .populate('autor', 'nome email usuario instituicao curso modulo') // 👈 ALTERAÇÃO AQUI
      .exec();
    if (!post) {
      throw new NotFoundException(`Post com id ${id} não encontrado`);
    }
    return post;
  }

async create(createPostDto: CreatePostDTO, autorId: string): Promise<Post> {
    const postCompleto = {
      ...createPostDto,
      autor: autorId,
    };
    const novoPost = new this.postModel(postCompleto);
    
    // 👇 A CORREÇÃO É NESTA LINHA: Adicionamos a tipagem : PostDocument
    const postSalvo: PostSchema = await novoPost.save();

    // Chamamos findOne para retornar o post já populado
    return this.findOne(postSalvo._id.toString());
}
  async update(id: string, updatePostDTO: UpdatePostDTO, userId: string): Promise<Post> {
    validateId(id);
    const postExistente = await this.postModel.findById(id);

    if (!postExistente) {
      throw new NotFoundException(`Post com id ${id} não encontrado`);
    }
    
    if (postExistente.autor.toString() !== userId) {
      throw new UnauthorizedException('Você não tem permissão para editar este post.');
    }

    const postAtualizado = await this.postModel
      .findByIdAndUpdate(id, updatePostDTO, { new: true })
      .populate('autor', 'nome email usuario instituicao curso modulo') // 👈 ALTERAÇÃO AQUI
      .exec();

    if (!postAtualizado) { // Adicionando uma verificação caso o update não retorne um post
        throw new NotFoundException(`Post com id ${id} não encontrado após tentativa de atualização.`);
    }
    return postAtualizado;
  }

  async delete(id: string, userId: string): Promise<{ message: string }> {
    validateId(id);
    const postExistente = await this.postModel.findById(id);

    if (!postExistente) {
      throw new NotFoundException(`Post com id ${id} não encontrado`);
    }
    
    if (postExistente.autor.toString() !== userId) {
      throw new UnauthorizedException('Você não tem permissão para deletar este post.');
    }
    
    await this.postModel.findByIdAndDelete(id).exec();
    
    return { message: `Post com id ${id} foi deletado com sucesso.` };
  }
}