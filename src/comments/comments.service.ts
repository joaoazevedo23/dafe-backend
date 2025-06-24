import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comments, CommentsSchema } from './../../models/comments.schema';
import { CreateCommentDTO } from './dtos/create-comment.dto';
import { validateId } from 'src/utils/validate-id';
import { PostService } from '../post/post.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comments.name)
    private readonly commentSchema: Model<CommentsSchema>,
    private readonly postService: PostService,
  ) { }

  async create(
    dto: CreateCommentDTO,
    autorId: string,
    postId: string,
  ): Promise<Comments> {
    validateId(postId);

    const novoComentario = new this.commentSchema({
      ...dto,
      autor: autorId,
      post: postId,
    });


    const comentarioSalvo = await novoComentario.save();

    await this.postService.incrementCommentsCount(postId);
    return comentarioSalvo.populate('autor', 'nome email');
  }

  async findByPost(postId: string): Promise<Comments[]> {
    validateId(postId);
    return this.commentSchema
      .find({ post: postId })
      .populate('autor', 'nome email')
      .sort({ data: 'desc' });
  }

  async findByAluno(alunoId: string): Promise<Comments[]> {
    validateId(alunoId);
    return this.commentSchema
      .find({ autor: alunoId })
      .populate('post', 'titulo')
      .sort({ data: 'desc' });
  }

  async delete(commentId: string, userId: string): Promise<{ message: string }> {
    validateId(commentId);
    const comment = await this.commentSchema.findById(commentId).populate('post');
    if (!comment) {
      throw new NotFoundException(`Comentário com id ${commentId} não encontrado.`);
    }

    if (!comment.post || !comment.post['autor']) {

      console.warn(`Post ${comment.post ? comment.post['_id'] : 'n/a'} não tem autor populado ou definido.`);
    }

    const isCommentAuthor = comment.autor.toString() === userId;
    const isPostAuthor = comment.post && comment.post['autor'] ? comment.post['autor'].toString() === userId : false;

    if (!isCommentAuthor && !isPostAuthor) {
      throw new UnauthorizedException('Você não tem permissão para deletar este comentário.');
    }

    const postId = comment.post instanceof Types.ObjectId ? comment.post.toString() : comment.post._id.toString();

    await this.commentSchema.findByIdAndDelete(commentId);
    await this.postService.decrementCommentsCount(postId);
    return { message: 'Comentário deletado com sucesso.' };
  }
}