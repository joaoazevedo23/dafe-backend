import { Module } from '@nestjs/common';
import { UsersController } from './users.controller'; 
import { UsersService } from './users.service'; 
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../models/user.schema'; 
import { MatchConstraint } from 'src/utils/decorators/match.decorator';
import { EncryptService } from 'src/utils/encrypt/encrypt.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UsersController],
  providers: [UsersService, MatchConstraint, EncryptService],
  exports: [UsersService],
})

export class UsersModule {}