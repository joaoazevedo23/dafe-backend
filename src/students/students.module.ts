import { Module } from '@nestjs/common';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from '../../models/student.schema';
import { Match } from 'src/utils/match.decorator';

@Module({
  imports: [MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema}])],
  controllers: [StudentsController],
  providers: [StudentsService, Match]
})
export class StudentsModule {}
