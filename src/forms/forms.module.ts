import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FormsService } from './forms.service';
import { FormsController } from './forms.controller';
import { Form, FormSchema } from 'src/models/forms.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Form.name, schema: FormSchema }]), FormsService],
  controllers: [FormsController],
  providers: [FormsService],
  exports: [FormsService],
})
export class FormsModule {}
