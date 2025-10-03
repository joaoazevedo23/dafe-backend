import { ResponseController } from './response.controller';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Response, ResponseSchema } from '../../models/response.schema';
import { Form, FormSchema } from '../../models/forms.schema';
import { ResponseService } from './response.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Response.name, schema: ResponseSchema },
      { name: Form.name, schema: FormSchema }, 
    ]),
  ],
  controllers: [ResponseController],
  providers: [ResponseService],
})
export class ResponseModule {}
