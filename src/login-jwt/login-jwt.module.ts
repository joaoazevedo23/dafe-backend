import { Module } from '@nestjs/common';
import { LoginJwtService } from './login-jwt.service';
import { LoginJwtController } from './login-jwt.controller';
import { JwtModule } from '@nestjs/jwt';
import { EncryptService } from 'src/utils/encrypt/encrypt.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from 'models/student.schema';
import { PassportModule } from '@nestjs/passport'; // Certifique-se de importar o PassportModule
import { JwtStrategy } from './jwt.strategy';  // Importe sua estratégia JWT
import { StudentsModule } from 'src/students/students.module';


// Módulo mais complexo. Conexões somente com  o Students. Ele basicamente é o verificador dos logins.
// Importa o banco de dados para verificar os dados.

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
    JwtModule.register({
      secret: 'segredo_shiiiu',
    }),
    PassportModule,  
    StudentsModule
  ],
  providers: [LoginJwtService, EncryptService, JwtStrategy],  
  controllers: [LoginJwtController],
})
export class LoginJwtModule {}