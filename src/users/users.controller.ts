import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service'; // Renomeado
import { CreateUsersDTO } from './dtos/create-users.dto'; // DTO correto
import { UpdateUsersDTO } from './dtos/update-users.dto'; // DTO correto
import { EncryptService } from 'src/utils/encrypt/encrypt.service';
import { User } from '../../models/user.schema'; // Importando o tipo User para clareza

@Controller('users') // Correção 1: Rota principal agora é 'users'
export class UsersController { // Correção 2: Nome do Controller atualizado
    constructor(
        private readonly usersService: UsersService, // Correção 3: Injetando o serviço correto
        private readonly encryptService: EncryptService,
    ) {}

    /* GET /users -- get para puxar todos os usuários
        GET /users?role=student -- get para puxar todos os estudantes
        GET /users?curso=DS&modulo=1 -- get para puxar estudantes específicos
        GET /users/:id -- get para puxar um usuário selecionado
        POST /users -- post para criar novos usuários
        PATCH /users/:id -- patch para atualizar um usuário
        DELETE /users/:id -- delete para deletar um usuário
    */

    @Get()
    async findAll(
        @Query('modulo') modulo?: string, // Recebe como string
        @Query('curso') curso?: string, // Enums podem ser validados no DTO, mas aqui é flexível
    ): Promise<User[]> {
        // Correção 4: Adicionado async/await e conversão de tipo explícita
        // O serviço já lida com a lógica de filtro, então só passamos os valores.
        const moduloAsNumber = modulo ? Number(modulo) : undefined;
        return this.usersService.findAll(curso, moduloAsNumber);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<User> {
        return this.usersService.findOne(id);
    }

    @Post()
    async create(@Body() createUserDto: CreateUsersDTO): Promise<User> {
        // Criptografa a senha antes de enviar para o serviço
        createUserDto.senha = await this.encryptService.encrypt(createUserDto.senha);
        return this.usersService.create(createUserDto);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUsersDTO): Promise<User> {
        // Correção 5: Lógica CRÍTICA para criptografar a senha apenas se ela for alterada
        if (updateUserDto.senha) {
            updateUserDto.senha = await this.encryptService.encrypt(updateUserDto.senha);
        }
        return this.usersService.update(id, updateUserDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<{ message: string }> {
        return this.usersService.delete(id);
    }
}