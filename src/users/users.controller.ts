import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service'; 
import { CreateUsersDTO } from './dtos/create-users.dto'; 
import { UpdateUsersDTO } from './dtos/update-users.dto';
import { EncryptService } from 'src/utils/encrypt/encrypt.service';
import { User } from '../../models/user.schema'; 

@Controller('users') // Rota principal 'users'
export class UsersController { 
    constructor(
        private readonly usersService: UsersService, 
        private readonly encryptService: EncryptService,
    ) {}

    /*  GET /users -- get para puxar todos os usuários
        GET /users?role=student -- get para puxar todos os estudantes
        GET /users?curso=DS&modulo=1 -- get para puxar estudantes específicos
        GET /users/:id -- get para puxar um usuário selecionado
        POST /users -- post para criar novos usuários
        PATCH /users/:id -- patch para atualizar um usuário
        DELETE /users/:id -- delete para deletar um usuário
    */

    @Get()
    async findAll(@Query('modulo') modulo?: string, @Query('curso') curso?: string, @Query('role') role?: string): Promise<User[]> {
        const moduloAsNumber = modulo ? Number(modulo) : undefined;
        return this.usersService.findAll(curso, moduloAsNumber, role);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<User> {
        return this.usersService.findOne(id);
    }

    @Post()
    async create(@Body() createUserDto: CreateUsersDTO): Promise<User> {
        createUserDto.senha = await this.encryptService.encrypt(createUserDto.senha);
        return this.usersService.create(createUserDto);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUsersDTO): Promise<User> {
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