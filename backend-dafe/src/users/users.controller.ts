import { Controller, Delete, Get, Post, Query } from '@nestjs/common';

@Controller('users')
export class UsersController {

    /* 
        GET /users -- get para puxar todos os users
        GET /users/:id -- get para puxar um users selecionado
        POST /users -- post para lançar novos users
        DELETE /users/:id -- delete para deletar um user selecionado
    */

    @Get() // /users?stu_modulo=1_ano&stu_curso=DS
    findAll(
        @Query('stu_modulo') stu_modulo?: '1_ano' | '2_ano' | '3_ano',
        @Query('stu_curso') stu_curso?: 'DS' | 'ADM' | 'LOG',
    ){
        return {
            modulo: stu_modulo,
            curso: stu_curso,
        };
    }

    @Get(':id') // pegar só um
    findOne(@Query('id') id: string) {
        return []
    }

    @Post() // /users
    create() {
        return []
    }

    @Delete(':id') // /users
    delete(@Query('id') id: string) {
        return []
    }

}
