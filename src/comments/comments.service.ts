
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comments, CommentsSchema } from './../../models/comments.schema'; 
import { CreateCommentDTO } from './dtos/create-comment.dto';
import { validateId } from 'src/utils/validate-id'; 

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comments.name)
    private readonly commentModel: Model<CommentsSchema>,
  ) {}

  async create(
    dto: CreateCommentDTO,
    autorId: string,
    postId: string,
  ): Promise<Comments> {
    validateId(postId);

    const novoComentario = new this.commentModel({
      ...dto,
      autor: autorId,
      post: postId,
    });

    const comentarioSalvo = await novoComentario.save();
    return comentarioSalvo.populate('autor', 'nome email');
  }

  async findByPost(postId: string): Promise<Comments[]> {
    validateId(postId);
    return this.commentModel
      .find({ post: postId })
      .populate('autor', 'nome email')
      .sort({ data: 'desc' }); 
  }

  async findByAluno(alunoId: string): Promise<Comments[]> {
    validateId(alunoId);
    return this.commentModel
      .find({ autor: alunoId })
      .populate('post', 'titulo')
      .sort({ data: 'desc' }); 
  }

  async delete(commentId: string, userId: string): Promise<{ message: string }> {
    validateId(commentId);
    
    const comment = await this.commentModel.findById(commentId);
    if (!comment) {
      throw new NotFoundException(`Comentário com id ${commentId} não encontrado.`);
    }

    if (comment.autor.toString() !== userId) {
      throw new UnauthorizedException('Você não tem permissão para deletar este comentário.');
    }

    await this.commentModel.findByIdAndDelete(commentId);
    return { message: 'Comentário deletado com sucesso.' };
  }
}