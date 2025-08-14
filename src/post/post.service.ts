import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostSchema } from '../../models/post.schema';
import { CreatePostDTO } from './dtos/create-post.dto';
import { UpdatePostDTO } from './dtos/update-post.dto';
import { validateId } from 'src/utils/decorators/validate-id';
import { UserRole } from '../../models/user.schema';

// Interface para o payload do usuário, espelhando a do controller
interface UserPayload {
  id: string;
  role: UserRole;
}

@Injectable()
export class PostService {
  constructor(
    // Correção: O tipo do modelo deve ser PostDocument (ou Post)
    @InjectModel(Post.name) private readonly postModel: Model<PostSchema>,
  ) {}

  // Correção: String de populate atualizada para o novo schema de User
  private readonly userPopulateFields = 'nome email usuario role studentDetails';

  async findAll(topico?: string, autor?: string): Promise<Post[]> {
    const query: any = {};
    if (topico) query.topico = topico;
    if (autor) query.autor = autor;

    return this.postModel
      .find(query)
      .sort({ createdAt: -1 })
      .populate('autor', this.userPopulateFields) // Usando a string corrigida
      .exec();
  }

  async findOne(id: string): Promise<Post> {
    validateId(id);
    const post = await this.postModel
      .findById(id)
      .populate('autor', this.userPopulateFields) // Usando a string corrigida
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
    const postSalvo = await novoPost.save();

    return this.findOne(postSalvo._id.toString());
  }

  // Correção: Assinatura do método e lógica de permissão atualizadas
  async update(id: string, updatePostDTO: UpdatePostDTO, user: UserPayload): Promise<Post> {
    validateId(id);
    const postExistente = await this.postModel.findById(id);
    if (!postExistente) {
      throw new NotFoundException(`Post com id ${id} não encontrado`);
    }

    // Lógica de permissão: Permite se o usuário for o autor OU se for um admin
    if (postExistente.autor.toString() !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Você não tem permissão para editar este post.');
    }

    const postAtualizado = await this.postModel
      .findByIdAndUpdate(id, updatePostDTO, { new: true })
      .populate('autor', this.userPopulateFields) // Usando a string corrigida
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

    if (post.interactedBy.some((interactorId) => interactorId.toString() === userId)) {
      throw new BadRequestException(`Você já interagiu com este post.`);
    }

    const updatePost = await this.postModel
      .findByIdAndUpdate(postId, { $inc: { interacao: 1 }, $push: { interactedBy: userId } }, { new: true })
      .populate('autor', this.userPopulateFields) // Usando a string corrigida
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
      .populate('autor', this.userPopulateFields) // Usando a string corrigida
      .exec();

    if (!updatedPost) {
      throw new NotFoundException(`Post com id ${postId} não encontrado`);
    }
    return updatedPost;
  }

  async decrementCommentsCount(postId: string): Promise<Post> {
    validateId(postId);
    const updatedPost = await this.postModel
      .findByIdAndUpdate(postId, { $inc: { commentsCount: -1 } }, { new: true })
      .populate('autor', this.userPopulateFields) // Usando a string corrigida
      .exec();

    if (!updatedPost) {
      throw new NotFoundException(`Post com id ${postId} não encontrado`);
    }

    if (updatedPost.commentsCount < 0) {
      await this.postModel.findByIdAndUpdate(postId, { $set: { commentsCount: 0 } }).exec();
      updatedPost.commentsCount = 0;
    }
    return updatedPost;
  }

  // Correção: Assinatura do método e lógica de permissão atualizadas
  async delete(id: string, user: UserPayload): Promise<{ message: string }> {
    validateId(id);
    const postExistente = await this.postModel.findById(id);
    if (!postExistente) {
      throw new NotFoundException(`Post com id ${id} não encontrado`);
    }

    // Lógica de permissão: Permite se o usuário for o autor OU se for um admin
    if (postExistente.autor.toString() !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Você não tem permissão para deletar este post.');
    }

    await postExistente.deleteOne();
    return { message: `Post com id ${id} foi deletado com sucesso.` };
  }
}