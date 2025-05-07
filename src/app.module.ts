import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PostModule } from './post/post.module';
import { CommentsModule } from './comments/comments.module';
import { StudentsModule } from './students/students.module';
import { ComplaintsModule } from './complaints/complaints.module';
import { EncryptService } from './utils/encrypt/encrypt.service';
import { LoginJwtModule } from './login-jwt/login-jwt.module';


@Module({

  imports: [
    MongooseModule.forRoot('link para concção com o banco Mongo DB - Pode ser local ou online'),
    PostModule,
    CommentsModule,
    StudentsModule,
    ComplaintsModule,
    LoginJwtModule
  ],

  controllers: [AppController],
  providers: [AppService, EncryptService],
})
export class AppModule { }
