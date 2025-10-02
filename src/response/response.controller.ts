import { Controller, Post, Param, Body } from '@nestjs/common';
import { ResponseService } from './response.service';
import { CreateResponseDto } from './dto/create-response.dto';

@Controller('forms')
export class ResponseController {
  constructor(private readonly responseService: ResponseService) {}

  @Post(':formId/responses')
  async createResponse(
    @Param('formId') formId: string,
    @Body() body: CreateResponseDto
  ) {
    const { usuario, respostas } = body;
    if (typeof usuario !== 'string') {
      throw new Error('usuario must be a string');
    }
    return this.responseService.create(formId, usuario, respostas, { usuario, respostas });
  }
}
