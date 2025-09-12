import { Controller, Post, UseInterceptors, UploadedFile, HttpException, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import { UploadSchema } from '../../models/uploads.schema'; // Certifique-se de que o caminho está correto

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file')) // 'file' deve ser o nome do campo no formulário
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('Nenhum arquivo enviado.', HttpStatus.BAD_REQUEST);
    }
    
    // Valida o arquivo com o schema
    const validationResult = UploadSchema.safeParse({ file });

    if (!validationResult.success) {
      // Mapeia os erros para uma lista de strings
      const errorMessages = validationResult.error.issues.map(issue => issue.message);
      
      throw new HttpException(errorMessages, HttpStatus.BAD_REQUEST);
    }

    // Salva o arquivo e obtém o caminho
    const filePath = await this.uploadsService.saveFile(file);
    return { url: filePath }; // Retorna a URL para o frontend
  }
}