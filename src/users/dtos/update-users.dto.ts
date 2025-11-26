// src/users/dtos/update-users.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { CreateUsersDTO } from './create-users.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUsersDTO extends PartialType(CreateUsersDTO) {
    
    @IsOptional()
    @IsString()
    imageUrl?: string; 

    @IsOptional()
    @IsString()
    imageHash?: string; 

}