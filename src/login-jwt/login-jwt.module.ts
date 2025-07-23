import { Module } from '@nestjs/common';
import { LoginJwtService } from './login-jwt.service';
import { LoginJwtController } from './login-jwt.controller';
import { JwtModule } from '@nestjs/jwt';
import { EncryptService } from 'src/utils/encrypt/encrypt.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'models/user.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from 'src/users/users.module';
import { RefreshToken, RefreshTokenSchema } from 'models/refreshToken.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema },{ name: RefreshToken.name, schema: RefreshTokenSchema },]),
    JwtModule.register({secret: "segredo_shiiiu", signOptions: { expiresIn: '15m' },}),
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
export class LoginJwtModule {}
