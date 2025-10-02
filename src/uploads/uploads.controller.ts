/* import { Controller, Post, UseInterceptors, UploadedFile, HttpException, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import { UploadSchema } from '../../models/uploads.schema'; // Certifique-se de que o caminho está correto

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File){
    if (!file){
      throw new HttpException('Nenhum arquivo enviado.', HttpStatus.BAD_REQUEST);
    }

      const validationResult = UploadSchema.safeParse({ file });

      if(!validationResult.success) {
        const errorMessages = validationResult.error.issues.map(issue => issue.message);
        throw new HttpException(errorMessages, HttpStatus.BAD_REQUEST);
      }

      const filePath = await this.uploadsService.saveFile(file);
      return {url: filePath};
  }
}
 */