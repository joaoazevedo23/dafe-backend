import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostSchema } from '../../models/post.schema';
import { CreatePostDTO } from './dtos/create-post.dto';
import { UpdatePostDTO } from './dtos/update-post.dto';
import { validateId, isValidObjectId } from 'src/utils/decorators/validate-id';
import { UserRole } from '../../models/user.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service'; // Importar CloudinaryService

// Interface para o payload do usuário, espelhando a do controller
interface UserPayload {
  id: string;
  role: UserRole;
}

// Tipo Multer.File do Express simplificado
interface File {
    buffer: Buffer; // Tipo simplificado
}

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostSchema>,
    private readonly cloudinaryService: CloudinaryService, // Injetar CloudinaryService
  ) {}

  private readonly userPopulateFields = 'nome email usuario role studentDetails';

  async findAll(topico?: string, autor?: string): Promise<Post[]> {
    const query: any = {};
    if (topico) query.topico = topico;
    if (autor) query.autor = autor;

    return this.postModel
      .find(query)
      .sort({ createdAt: -1 })
      .populate('autor', this.userPopulateFields)
      .exec();
  }

  async findOne(idOrSlug: string): Promise<Post> {
    let post;

    if (isValidObjectId(idOrSlug)) {
      validateId(idOrSlug);
      post = await this.postModel
        .findById(idOrSlug)
        .populate('autor', this.userPopulateFields)
        .exec();
    } else {
      post = await this.postModel
        .findOne({ slug: idOrSlug })
        .populate('autor', this.userPopulateFields)
        .exec();
    }

    if (!post) {
      throw new NotFoundException(`Post com identificador "${idOrSlug}" não encontrado`);
    }

    return post;
  }

  async create(createPostDto: CreatePostDTO, autorId: string, file?: File): Promise<Post> {
    let imageUrl: string | undefined;
    if (file) {
      const uploadResult = await this.cloudinaryService.uploadImage(file as any); 
      imageUrl = uploadResult.secure_url; 
    }
    
    if (createPostDto.imageHash && !imageUrl) {
        imageUrl = createPostDto.imageHash;
    }

    const postCompleto = {
      ...createPostDto,
      autor: autorId,
      imageHash: imageUrl, 
    };
    
    const novoPost = new this.postModel(postCompleto);
    const postSalvo = await novoPost.save();

    return this.findOne(postSalvo._id.toString());
  }

  async update(idOrSlug: string, updatePostDTO: UpdatePostDTO, user: UserPayload): Promise<Post> {
    let postExistente;

    if (isValidObjectId(idOrSlug)) {
      validateId(idOrSlug);
      postExistente = await this.postModel.findById(idOrSlug);
    } else {
      postExistente = await this.postModel.findOne({ slug: idOrSlug });
    }

    if (!postExistente) {
      throw new NotFoundException(`Post com identificador "${idOrSlug}" não encontrado`);
    }

    if (postExistente.autor.toString() !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Você não tem permissão para editar este post.');
    }

    let postAtualizado;

    if (isValidObjectId(idOrSlug)) {
      postAtualizado = await this.postModel
        .findByIdAndUpdate(idOrSlug, updatePostDTO, { new: true })
        .populate('autor', this.userPopulateFields)
        .exec();
    } else {
      postAtualizado = await this.postModel
        .findOneAndUpdate({ slug: idOrSlug }, updatePostDTO, { new: true })
        .populate('autor', this.userPopulateFields)
        .exec();
    }

    if (!postAtualizado) {
      throw new NotFoundException(`Post com identificador "${idOrSlug}" não encontrado após tentativa de atualização.`);
    }

    return postAtualizado;
  }

  async addInteracao(postIdOrSlug: string, userId: string): Promise<Post> {
    let post;

    if (isValidObjectId(postIdOrSlug)) {
      validateId(postIdOrSlug);
      post = await this.postModel.findById(postIdOrSlug);
    } else {
      post = await this.postModel.findOne({ slug: postIdOrSlug });
    }

    if (!post) {
      throw new NotFoundException(`Post com identificador "${postIdOrSlug}" não encontrado`);
    }

    if (post.interactedBy.some((interactorId) => interactorId.toString() === userId)) {
      throw new BadRequestException(`Você já interagiu com este post.`);
    }

    let updatedPost;

    if (isValidObjectId(postIdOrSlug)) {
      updatedPost = await this.postModel
        .findByIdAndUpdate(
          postIdOrSlug,
          { $inc: { interacao: 1 }, $push: { interactedBy: userId } },
          { new: true },
        )
        .populate('autor', this.userPopulateFields)
        .exec();
    } else {
      updatedPost = await this.postModel
        .findOneAndUpdate(
          { slug: postIdOrSlug },
          { $inc: { interacao: 1 }, $push: { interactedBy: userId } },
          { new: true },
        )
        .populate('autor', this.userPopulateFields)
        .exec();
    }

    if (!updatedPost) {
      throw new NotFoundException(`Post com identificador "${postIdOrSlug}" não encontrado`);
    }

    return updatedPost;
  }

  async incrementCommentsCount(postId: string): Promise<Post> {
    validateId(postId);
    const updatedPost = await this.postModel
      .findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } }, { new: true })
      .populate('autor', this.userPopulateFields)
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
      .populate('autor', this.userPopulateFields)
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

  async delete(idOrSlug: string, user: UserPayload): Promise<{ message: string }> {
    let postExistente;

    if (isValidObjectId(idOrSlug)) {
      validateId(idOrSlug);
      postExistente = await this.postModel.findById(idOrSlug);
    } else {
      postExistente = await this.postModel.findOne({ slug: idOrSlug });
    }

    if (!postExistente) {
      throw new NotFoundException(`Post com identificador "${idOrSlug}" não encontrado`);
    }

    if (postExistente.autor.toString() !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Você não tem permissão para deletar este post.');
    }

    await postExistente.deleteOne();

    return { message: `Post com identificador "${idOrSlug}" foi deletado com sucesso.` };
  }
}