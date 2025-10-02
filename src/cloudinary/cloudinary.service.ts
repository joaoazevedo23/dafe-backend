import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream from 'buffer-to-stream'; // Usaremos 'buffer-to-stream' para pipe

// Tipo Multer.File do Express simplificado
interface File {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    // Configura o Cloudinary usando variáveis de ambiente
    v2.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
      secure: true,
    });
  }

   async uploadImage(file: File): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        { folder: 'seu_projeto_posts' },
        (error, result) => {
          if (error) {
            // Se houver um erro de upload, rejeita a Promise
            return reject(error);
          }
          
          if (!result) {
            // Se não houver erro, mas o resultado estiver ausente (situação improvável, mas para segurança do TS)
            return reject(new Error('Cloudinary upload returned no result.'));
          }
          
          // Se chegou aqui, o upload foi bem-sucedido e 'result' não é undefined.
          resolve(result);
        },
      );
      // ... restante do código:
      toStream(file.buffer).pipe(upload);
    });
  }
}