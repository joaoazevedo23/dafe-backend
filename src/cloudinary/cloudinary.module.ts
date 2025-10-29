import { Module, Global } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { ConfigModule } from '@nestjs/config';

// Serviço disponível em todo o projeto
@Global()
@Module({
  imports: [ConfigModule], // Ler as variáveis de ambiente
  providers: [CloudinaryService],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}