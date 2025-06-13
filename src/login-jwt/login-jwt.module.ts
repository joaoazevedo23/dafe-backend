import { Module } from '@nestjs/common';
import { LoginJwtService } from './login-jwt.service';
import { LoginJwtController } from './login-jwt.controller';
import { JwtModule } from '@nestjs/jwt';
import { EncryptService } from 'src/utils/encrypt/encrypt.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from 'models/student.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { StudentsModule } from 'src/students/students.module';
import { RefreshToken, RefreshTokenSchema } from 'models/refreshToken.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Student.name, schema: StudentSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
      inject: [ConfigService],
    }),
    PassportModule,
    StudentsModule,
  ],
  providers: [
    LoginJwtService,
    EncryptService,
    JwtStrategy,
  ],
  controllers: [LoginJwtController],
  exports: [
    LoginJwtService,
    JwtModule,
    PassportModule,
  ],
})
export class LoginJwtModule { }