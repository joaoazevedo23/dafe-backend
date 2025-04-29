import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {PostagemModule} from '../src/postagem/postagem.module';

@Module({
  imports: [PostagemModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
