import { Module } from '@nestjs/common';
import { UsersController } from './users.controller'; 
import { UsersService } from './users.service'; 
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../models/user.schema'; 
import { Match } from 'src/utils/match.decorator';
import { EncryptService } from 'src/utils/encrypt/encrypt.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UsersController],
  providers: [UsersService, Match, EncryptService],
  exports: [UsersService],
})

export class UsersModule {}