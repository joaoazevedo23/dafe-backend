import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { PostModule } from './posts/post.module';
import { CommentsModule } from './comments/comments.module';
import { UsersModule } from './users/users.module';
import { ComplaintsModule } from './complaints/complaints.module';
import { LoginJwtModule } from './login-jwt/login-jwt.module';
import { FormsModule } from './forms/forms.module';
import { NewsModule } from './news/news.module';
import { MailerModule } from './mailer/mailer.module';
import { AuthModule } from './auth/auth.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ResponsesModule } from './responses/responses.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService): Promise<MongooseModuleOptions> => ({
        uri: configService.get<string>('MONGO_URI')!,
      }),
      inject: [ConfigService],
    }),

    PostModule,
    CommentsModule,
    UsersModule,
    ComplaintsModule,
    LoginJwtModule,
    FormsModule,
    NewsModule,
    MailerModule,
    AuthModule,
    CloudinaryModule,
    ResponsesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }