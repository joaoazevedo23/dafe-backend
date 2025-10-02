import { Module, Global } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { ConfigModule } from '@nestjs/config';

// @Global() torna o serviço disponível em todo o projeto
@Global()
@Module({
  imports: [ConfigModule], // Para ler as variáveis de ambiente
  providers: [CloudinaryService],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}