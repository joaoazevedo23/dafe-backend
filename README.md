# 📚 DAFE – API de Feedback Escolar e Fóruns de Conversa

Esta é a **API do projeto DAFE**, uma aplicação voltada para o feedback escolar e fóruns de conversa entre alunos. Desenvolvida com **NestJS** e conectada a um banco de dados **MongoDB Atlas**, a API oferece um conjunto robusto de funcionalidades para:

- Registro de usuários
- Criação de posts e notícias
- Envio de denúncias
- Gerenciamento de formulários de feedback

---

## ⚙️ Tecnologias Utilizadas

- **NestJS** – Framework para Node.js
- **MongoDB Atlas** – Banco de dados na nuvem
- **Mongoose** – ODM para MongoDB
- **JWT (JSON Web Token)** – Autenticação e autorização
- **Thunder Client** – Cliente HTTP para testes de API

---

## 📌 Funcionalidades

### ✅ Implementadas – Funcionando

- **Autenticação com JWT**  
  Proteção completa das rotas, incluindo login e autenticação com token.

- **Gerenciamento de Usuários** `/users`  
  Registro de usuários com suporte a roles: `student`, `professor`, `manager`, `admin`.

- **Fóruns de Conversa** `/posts`  
  Criação, visualização, atualização e exclusão de posts.

- **Notícias** `/news`  
  Criação e gestão de notícias institucionais.

- **Comentários** `/comments`  
  Sistema de comentários nos posts.

- **Formulários de Feedback** `/forms` e `/answers`  
  Criação de formulários e envio de respostas.

- **Denúncias** `/complaints`  
  Envio de denúncias relacionadas ao ambiente escolar.

### ⚠️ Em Desenvolvimento

- [ ] Suporte para **upload de imagens** em posts e notícias.
- [ ] Funcionalidade "**Esqueci minha senha**" com envio de e-mail para recuperação.
- [ ] **Documentação completa** dos endpoints com exemplos de payloads e respostas.

---

## 🛠️ Como Utilizar

```bash
# 1. Clone o repositório
git clone https://github.com/joaoazevedo23/dafe-backend

# 2. Instale as dependências
npm install

# 3. Configure o Banco de Dados
# Crie seu cluster no MongoDB Atlas e adicione a string de conexão no arquivo `.env` ou de configuração.

# 4. Execute o projeto
npm run start:dev
```

## 🔐 Autenticação e Acesso

Para acessar rotas protegidas da API, siga os passos abaixo:

1. **Registre um usuário**  
Envie uma requisição `POST` para o endpoint:
```bash
POST/user
```
   
2. **Faça login**  
Envie uma requisição `POST` para o endpoint:
```bash
POST /login-jwt
```

Isso retornará um token JWT.

3. **Use o token nas rotas protegidas**  
Inclua o token JWT no cabeçalho das suas requisições:
```bash
Authorization: Bearer seu_token_jwt
```

---

## 📋 Próximos Passos

- [ ] Adicionar suporte a imagens em posts e notícias.
- [ ] Implementar recuperação de senha via e-mail.
- [ ] Criar documentação completa dos endpoints da API.

---

## ❓ Dúvidas ou Sugestões?

Se precisar de ajuda ou tiver alguma sugestão, sinta-se à vontade para entrar em contato!
