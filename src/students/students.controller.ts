import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentsDTO } from './dtos/create-students.dto';   
import { UpdateStudentsDTO } from './dtos/update-students.dto';
import { EncryptService } from 'src/utils/encrypt/encrypt.service';

@Controller('students')
export class StudentsController {
    constructor(
    private readonly studentsService: StudentsService,
    private readonly encryptService: EncryptService,){}

    /* 
        GET /students -- get para puxar todos os students
        GET /students/:id -- get para puxar um students selecionado
        POST /students -- post para lançar novos students
        DELETE /students/:id -- delete para deletar um user selecionado
    */

    @Get() // /students?modulo=1&curso=DS
    findAll(
        @Query('modulo') modulo?: '1' | '2' | '3',
        @Query('curso') curso?: 'Desenvolvimento de Sistemas' | 'Administração' | 'Logistica',
    ){
        const aluno = this.studentsService.findAll(curso, Number(modulo))
        return aluno
    }

    @Get(':id') // pegar só um students
    findOne(@Param('id') id: string) {
        return this.studentsService.findOne(id)
    }

    @Post() // /students
    async create(@Body() student: CreateStudentsDTO) {
        student.senha = await this.encryptService.encrypt(student.senha);
        return this.studentsService.create(student)
    }

    @Patch(':id') // /students     
    update(@Param('id') id: string, @Body() student: UpdateStudentsDTO) {
        return this.studentsService.update(id, student)
    }

    @Delete(':id') // /students
    delete(@Param('id') id: string) {
        return this.studentsService.delete(id)
    }
}
