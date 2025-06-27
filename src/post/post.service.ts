import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
  ) { }

  async findAll(topico?: string, autor?: string): Promise<Post[]> {
    const query: any = {};
    if (topico) query.topico = topico;
    if (autor) query.autor = autor;

    return this.postModel
      .find(query)
      .sort({ createdAt: -1 })
      .populate('autor', 'nome email usuario instituicao curso modulo')
      .exec();
  }

  async findOne(id: string): Promise<Post> {
    validateId(id);
    const post = await this.postModel
      .findById(id)
      .populate('autor', 'nome email usuario instituicao curso modulo')
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
      .populate('autor', 'nome email usuario instituicao curso modulo')
      .exec();
    if (!postAtualizado) { 
      throw new NotFoundException(`Post com id ${id} não encontrado após tentativa de atualização.`);
    }
    return postAtualizado;
  }

  async addInteracao(postId: string, userId: string): Promise<Post> {
    validateId(postId);
    const post = await this.postModel.findById(postId);

    if (!post) {
      throw new NotFoundException(`Post com id ${postId} não encontrado`);
    }

    if (post.interactedBy.some(interactorId => interactorId.toString() === userId)) {
      throw new BadRequestException(`Você já interagiu com este post.`);
    }

    const updatePost = await this.postModel
      .findByIdAndUpdate(postId, { $inc: { interacao: 1 }, $push: { interactedBy: userId } }, { new: true })
      .populate('autor', 'nome email usuario instituicao curso modulo')
      .exec();

    if (!updatePost) {
      throw new NotFoundException(`Post com id ${postId} não encontrado`);
    }

    return updatePost;
  }

  async incrementCommentsCount(postId: string): Promise<Post> {
    validateId(postId);
    const updatedPost = await this.postModel
      .findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } }, { new: true })
      .populate('autor', 'nome email usuario instituicao curso modulo')
      .exec();

    if (!updatedPost) {
      console.warn(`Post com id ${postId} não encontrado ao tentar incrementar commentsCount.`);
      throw new NotFoundException(`Post com id ${postId} não encontrado`);
    }
    return updatedPost;
  }

  async decrementCommentsCount(postId: string): Promise<Post> {
    validateId(postId);
    // Remover -1 de comentário
    const updatedPost = await this.postModel
      .findByIdAndUpdate(postId, { $inc: { commentsCount: -1 } }, { new: true })
      .populate('autor', 'nome email usuario instituicao curso modulo')
      .exec();

    if (!updatedPost) {
      console.warn(`Post com id ${postId} não encontrado ao tentar decrementar commentsCount.`);
      throw new NotFoundException(`Post com id ${postId} não encontrado`);
    }

    if (updatedPost && updatedPost.commentsCount < 0) {

      await this.postModel.findByIdAndUpdate(postId, { $set: { commentsCount: 0 } }).exec();
      updatedPost.commentsCount = 0;
    }
    return updatedPost;
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
    await postExistente.deleteOne();
    return { message: `Post com id ${id} foi deletado com sucesso.` };
  }
}