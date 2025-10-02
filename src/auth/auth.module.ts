import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MailerModule } from '../mailer/mailer.module';
import { UsersModule } from '../users/users.module';
import { EncryptService } from 'src/utils/encrypt/encrypt.service';

@Module({
  imports: [
    UsersModule, 
    MailerModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '15m' }, 
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, EncryptService], 
})
export class AuthModule {}