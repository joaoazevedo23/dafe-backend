import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PostModule } from './posts/post.module';
import { CommentsModule } from './comments/comments.module';
import { UsersModule } from './users/users.module';
import { ComplaintsModule } from './complaints/complaints.module';
import { EncryptService } from './utils/encrypt/encrypt.service';
import { LoginJwtModule } from './login-jwt/login-jwt.module';
import { FormsModule } from './forms/forms.module';


@Module({

  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017'),
    PostModule,
    CommentsModule,
    UsersModule,
    ComplaintsModule,
    LoginJwtModule,
    FormsModule
  ],

  controllers: [AppController],
  providers: [AppService, EncryptService],
})
export class AppModule { }
