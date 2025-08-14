import { Controller, Get } from '@nestjs/common';
import { FormsService } from './forms.service';

@Controller('forms')
export class FormsController {
    constructor(private readonly formsService: FormsService){}

}
