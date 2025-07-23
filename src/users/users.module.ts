import { Module } from '@nestjs/common';
import { UsersController } from './users.controller'; // Corrigido
import { UsersService } from './users.service'; // Corrigido
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../models/user.schema'; // Corrigido
import { Match } from 'src/utils/match.decorator';
import { EncryptService } from 'src/utils/encrypt/encrypt.service';

// Módulo para gerenciar os usuários.
@Module({
  // Corrigido: Registrando o modelo 'User' no Mongoose
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],

  // Corrigido: Usando o controller de usuários
  controllers: [UsersController],

  // Corrigido: Usando o serviço de usuários
  providers: [UsersService, Match, EncryptService],
  
  // Corrigido: Exportando o serviço de usuários
  exports: [UsersService],
})
export class UsersModule {} // ✅ Corrigido: Nome da classe do módulo