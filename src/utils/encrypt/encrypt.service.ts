import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs'; 

@Injectable()
export class EncryptService {
  private saltRounds = 10; 

  constructor() {
    
  }

  // Função para encriptar a senha após o envio dos dados
  async encrypt(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.saltRounds); 
    return await bcrypt.hash(password, salt); 
  }

  async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword); // Compara as senhas
  }

  async createUser(senha: string, confirmarSenha: string): Promise<any> {
    if (senha !== confirmarSenha) {
      throw new Error('As senhas não coincidem!');
    }

    const hashedPassword = await this.encrypt(senha);

    return { mensagem: 'Usuário criado com sucesso!', senhaCriptografada: hashedPassword };
  }
}
