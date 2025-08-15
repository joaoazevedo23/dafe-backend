# 📚 DAFE – API de Feedback Escolar e Fóruns de Conversa

Esta é a API do projeto **DAFE**, uma aplicação voltada para o **feedback escolar** e **fóruns de conversa entre alunos**. Desenvolvida com **NestJS** e conectada a um banco de dados **MongoDB Atlas**, a API oferece rotas para registro de estudantes, criação de fóruns de discussão (posts), envio de denúncias e, em breve, permitirá comentários em posts e envio de formulários de feedback escolar.

---

## ⚙️ Tecnologias utilizadas

* [NestJS](https://nestjs.com/) – Framework para Node.js
* [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) – Banco de dados na nuvem
* [Mongoose](https://mongoosejs.com/) – ODM para MongoDB
* [JWT (JSON Web Token)](https://jwt.io/) – Autenticação e autorização
* [Thunder Client](https://www.thunderclient.com/) – Cliente HTTP para testes (usado para simular os envios)

---

## 📌 Funcionalidades atuais

### ✅ Implementadas - Funcionando

* **Autenticação com JWT**: atualmente protegendo as rotas de criação e acesso aos **posts** (fóruns).
* **`/students`**: registro de estudantes. Necessário se cadastrar aqui para acessar as outras funcionalidades protegidas.
* **`/posts`**: criação e visualização de fóruns de conversa entre estudantes (autenticado via JWT).
* **`/complaints`**: envio de denúncias relacionadas ao ambiente escolar.

### ⚠️ Em desenvolvimento

* **`/comments`**: comentários em posts (ainda não implementado).
* **`/feedback-forms`**: formulários para feedback escolar (em progresso).
* Integração completa com JWT para proteger mais rotas além dos posts.

---

## 🛠️ Como utilizar

### 1. Clone o repositório

```bash
git clone https://github.com/joaoazevedo23/dafe-backend
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Adicione o Mongo DB (Compass) 

Abra o arquivo:
```
dafe-backend/src/app.module.ts
```
E insira a conexão com o banco local. Estamos vendo como permitir que mais users acessem o banco online Atlas

### 4. Execute o projeto

```bash
npm run start:dev
```

---

## 🔐 Autenticação

Para acessar rotas protegidas (como `/posts`), siga os passos:

1. Registre um estudante com uma requisição `POST` em `/students`.
2. Faça o login com uma requisição `POST` em `/login-jwt`.
3. Envie o token no cabeçalho das requisições protegidas:

```http
Authorization: Bearer seu_token_jwt
```

> ⚠️ Atualmente, **apenas a rota de posts está protegida** por autenticação JWT.

---

## 🧪 Testes com Thunder Client

Para simular o envio de formulários e testar rotas, utilizei o **Thunder Client**. Recomendo os seguintes passos:

* Registre um estudante (`POST /students`)
* Copie o token JWT da resposta
* Use esse token no header das próximas requisições protegidas (`Authorization: Bearer <token>`)

---

## 📋 To-do (Próximos passos)

* [ ] Implementar e proteger a rota `/comments`
* [ ] Desenvolver e conectar os formulários de feedback escolar
* [ ] Expandir autenticação JWT para outras rotas
* [ ] Documentar endpoints

---

## ❓ Dúvidas?

Se quiser perguntar algo, estou disponível para ajudar. Ainda estou finalizando algumas partes do projeto, mas posso esclarecer qualquer ponto que não esteja claro no momento.
