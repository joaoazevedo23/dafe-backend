import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs'; // Biblioteca para criptografar senhas

@Injectable()
export class EncryptService {
  private saltRounds = 10; // Número de "salt rounds" para o bcrypt

  constructor() {
    
  }

  // Função para encriptar a senha (agora com o nome 'encrypt')
  async encrypt(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.saltRounds); // Gera o salt
    return await bcrypt.hash(password, salt); // Encripta a senha
  }

  // Função para comparar a senha fornecida com a armazenada no banco (para login)
  async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword); // Compara as senhas
  }

  // Função para criar um usuário (aqui é um exemplo simples, sem persistência)
  async createUser(senha: string, confirmarSenha: string): Promise<any> {
    if (senha !== confirmarSenha) {
      throw new Error('As senhas não coincidem!');
    }

    const hashedPassword = await this.encrypt(senha); // Chama a função 'encrypt' para criptografar a senha

    // Aqui você pode salvar o usuário no banco de dados (exemplo simples)
    // Exemplo: await this.userRepository.create({ senha: hashedPassword });

    return { mensagem: 'Usuário criado com sucesso!', senhaCriptografada: hashedPassword };
  }
}
