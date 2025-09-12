import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { extname, join } from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class UploadsService {
    async saveFile(file: Express.Multer.File): Promise<string> {
        const uploadDir = join(process.cwd(), 'uploads');
        
        try {
            await fs.mkdir(uploadDir, { recursive: true });
        } catch (error) {
            throw new HttpException('Não foi possível criar o diretório de uploads.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileName = `${uniqueSuffix}${extname(file.originalname)}`;
        const filePath = join(uploadDir, fileName);

        try {
            await fs.writeFile(filePath, file.buffer);
        } catch (error) {
            throw new HttpException('Falha ao salvar o arquivo.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        
        return `/uploads/${fileName}`;
    }
}