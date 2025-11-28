import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service'; 
import { CreateUsersDTO } from './dtos/create-users.dto'; 
import { UpdateUsersDTO } from './dtos/update-users.dto';
import { EncryptService } from 'src/utils/encrypt/encrypt.service';
import { User, UserRole } from '../models/user.schema'; 
import { Roles } from 'src/utils/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/login-jwt/jwt-auth.guard';
import { RolesGuard } from 'src/utils/guards/roles.guard';

@Controller('users')
export class UsersController { 
    constructor( // Injeção de dependências
        private readonly usersService: UsersService, 
        private readonly encryptService: EncryptService,
    ) {}

    @Get()
    @UseGuards(JwtAuthGuard) // Proteção a rota com autenticação JWT
    async findAll(
      @Query('modulo') modulo?: string, 
      @Query('curso') curso?: string, 
      @Query('role') role?: string
    ): Promise<User[]> {
        const moduloAsNumber = modulo ? Number(modulo) : undefined;
        return this.usersService.findAll(curso, moduloAsNumber, role);
    }

    @Get(':idOrSlug')
    @UseGuards(JwtAuthGuard)
    async findOne(@Param('idOrSlug') idOrSlug: string): Promise<User> {
        return this.usersService.findOne(idOrSlug);
    }

    @Post()
    @UseInterceptors(FileInterceptor('image')) // Interceptor para upload de arquivo
    async create(@Body() createUserDto: CreateUsersDTO, @UploadedFile() file: Express.Multer.File, ): Promise<User> {
        createUserDto.senha = await this.encryptService.encrypt(createUserDto.senha);
        return this.usersService.create(createUserDto, file);
    }

    @Patch(':idOrSlug')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('image'))
    async update(
      @Param('idOrSlug') idOrSlug: string, 
      @Body() updateUserDto: UpdateUsersDTO,
      @UploadedFile() file: Express.Multer.File
    ): Promise<User> {
        if (updateUserDto.senha) {
            updateUserDto.senha = await this.encryptService.encrypt(updateUserDto.senha);
        }
        return this.usersService.update(idOrSlug, updateUserDto, file);
    }

    @Delete(':idOrSlug')
    @Roles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async delete(@Param('idOrSlug') idOrSlug: string): Promise<{ message: string }> {
        return this.usersService.delete(idOrSlug);
    }
}
