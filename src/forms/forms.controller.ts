import { Controller, Get, UseGuards } from '@nestjs/common';
import { FormsService } from './forms.service';
import { JwtAuthGuard } from 'src/login-jwt/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('forms')
export class FormsController {
    constructor(private readonly formsService: FormsService){}

}
