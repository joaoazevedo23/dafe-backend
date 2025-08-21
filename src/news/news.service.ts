import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class NewsService {
    @InjectModel('News') private readonly newsModel;
}
