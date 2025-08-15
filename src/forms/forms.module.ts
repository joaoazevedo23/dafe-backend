import { Module } from '@nestjs/common';
import { FormsService } from './forms.service';
import { FormsController } from './forms.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Forms, FormsSchema } from 'models/forms.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Forms.name, schema: FormsSchema }]),
  ],
  providers: [FormsService],
  controllers: [FormsController]
})
export class FormsModule {}
