import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PostModule } from './posts/post.module';
import { CommentsModule } from './comments/comments.module';
import { UsersModule } from './users/users.module';
import { ComplaintsModule } from './complaints/complaints.module';
import { LoginJwtModule } from './login-jwt/login-jwt.module';
import { FormsModule } from './forms/forms.module';
import { NewsModule } from './news/news.module';
import { AnswerModule } from './answer/answer.module';
import { MailerModule } from './mailer/mailer.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/dafe-db'), 
    PostModule,
    CommentsModule,
    UsersModule,
    ComplaintsModule,
    LoginJwtModule,
    FormsModule,
    NewsModule,
    AnswerModule,
    MailerModule, 
    AuthModule, 
  ],
  controllers: [AppController],
  providers: [AppService], 
})
export class AppModule {}