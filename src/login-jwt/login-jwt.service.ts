import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { Student, StudentSchema } from 'models/student.schema';
import { EncryptService } from 'src/utils/encrypt/encrypt.service';

@Injectable()
export class LoginJwtService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly encryptService: EncryptService,
    @InjectModel(Student.name) private readonly studentsSchema: Model<StudentSchema>,
  ) {}

  async login(email: string, senha: string): Promise<{ token: string }> { // Tenta achar os dados do login no banco
    const student = await this.studentsSchema.findOne({ email }).exec();
    if (!student) {
      throw new UnauthorizedException('Email não encontrado');
    }

    const senhaValidate = await this.encryptService.comparePasswords(senha, student.senha);
    if (!senhaValidate) {
      throw new UnauthorizedException('Senha incorreta');
    }

    const payload = {sub: student._id, email: student.email};
    const token = this.jwtService.sign(payload, { expiresIn: '1h' }); // Expira em 1h
    return { token };
  }
}
