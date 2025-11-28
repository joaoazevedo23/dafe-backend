import { Module } from '@nestjs/common';
import { LoginJwtService } from './login-jwt.service';
import { LoginJwtController } from './login-jwt.controller';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt'; // Importe JwtModuleOptions
import { EncryptService } from 'src/utils/encrypt/encrypt.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/models/user.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from 'src/users/users.module';
import { RefreshToken, RefreshTokenSchema } from 'src/models/refreshToken.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<JwtModuleOptions> => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '15m' as any,
        },
      }),
    }),

    PassportModule,
    UsersModule,
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