import { Injectable } from '@nestjs/common';
import { Forms, FormsSchema} from '../../models/forms.schema'
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class FormsService {
    constructor(
        @InjectModel(Forms.name) private readonly formsModel: Model<FormsSchema>
    ){}

}
