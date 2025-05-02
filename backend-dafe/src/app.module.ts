import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PostModule } from './post/post.module';
import { CommentsModule } from './comments/comments.module';
import { UsersModule } from './users/users.module';
import { ComplaintsModule } from './complaints/complaints.module';


@Module({

  imports: [
    MongooseModule.forRoot('mongodb+srv://joaoazevedo:jgY8LYNmMBg9nI0r@poto.zqgwluj.mongodb.net/'),
    PostModule,
    CommentsModule,
    UsersModule,
    ComplaintsModule
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
