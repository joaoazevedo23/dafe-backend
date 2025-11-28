import { IsEnum, IsNotEmpty } from 'class-validator';
import { ComplaintStatus } from '../../models/complaints.schema'; 

export class UpdateComplaintStatusDto {
    @IsNotEmpty({ message: 'O status da denúncia é obrigatório.' })
    @IsEnum(ComplaintStatus, { message: 'Status inválido.' })
    status: ComplaintStatus;
}