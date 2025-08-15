import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comments, CommentsSchema } from './../../models/comments.schema';
import { CreateCommentDTO } from './dtos/create-comment.dto';
import { validateId } from 'src/utils/decorators/validate-id';
import { PostService } from '../posts/post.service';
import { UserRole } from '../../models/user.schema';

// Interface para o payload do usuário, garantindo consistência
interface UserPayload {
  id: string;
  role: UserRole;
}

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comments.name)
    private readonly commentModel: Model<CommentsSchema>, // Correção de tipo
    private readonly postService: PostService,
  ) {}

  // Consistência nos dados populados
  private readonly userPopulateFields = 'nome email usuario role';

  async create(dto: CreateCommentDTO, autorId: string, postId: string): Promise<Comments> {
    validateId(postId);
    const novoComentario = new this.commentModel({
      ...dto,
      autor: autorId,
      post: postId,
    });

    const comentarioSalvo = await novoComentario.save();
    await this.postService.incrementCommentsCount(postId);

    // Usando .populate() no documento salvo para retornar os dados do autor
    return comentarioSalvo.populate('autor', this.userPopulateFields);
  }

  async findByPost(postId: string): Promise<Comments[]> {
    validateId(postId);
    return this.commentModel
      .find({ post: postId })
      .populate('autor', this.userPopulateFields)
      .sort({ createdAt: 'desc' });
  }

  // ✅ Método renomeado de findByAluno para findByUser
  async findByUser(userId: string): Promise<Comments[]> {
    validateId(userId);
    return this.commentModel
      .find({ autor: userId })
      .populate('post', 'titulo')
      .sort({ createdAt: 'desc' });
  }

  // ✅ Assinatura e lógica do método delete atualizadas
  async delete(commentId: string, user: UserPayload): Promise<{ message: string }> {
    validateId(commentId);
    // Populamos o autor do post para a verificação de permissão
    const comment = await this.commentModel.findById(commentId).populate({
      path: 'post',
      select: 'autor',
    });

    if (!comment) {
      throw new NotFoundException(`Comentário com id ${commentId} não encontrado.`);
    }

    const isCommentAuthor = comment.autor.toString() === user.id;
    // O autor do post também pode deletar comentários no seu post
    const isPostAuthor = comment.post?.autor.toString() === user.id;
    // Um admin pode deletar qualquer comentário
    const isAdmin = user.role === UserRole.ADMIN;

    if (!isCommentAuthor && !isPostAuthor && !isAdmin) {
      throw new ForbiddenException('Você não tem permissão para deletar este comentário.');
    }

    const postId = (comment.post as any)._id.toString();
    await this.commentModel.findByIdAndDelete(commentId);
    await this.postService.decrementCommentsCount(postId);

    return { message: 'Comentário deletado com sucesso.' };
  }
}