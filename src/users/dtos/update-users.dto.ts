import { PartialType } from '@nestjs/mapped-types';
import { CreateUsersDTO } from './create-users.dto';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateUsersDTO extends PartialType(CreateUsersDTO) {
    @IsOptional()
    @IsUrl()
    imageUrl?: string;

    @IsOptional()
    @IsString()
    imageHash?: string;
}