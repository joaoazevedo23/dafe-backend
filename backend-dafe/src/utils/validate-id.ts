import { NotFoundException } from "@nestjs/common";
import { Types } from "mongoose";

export function validateId(id: string): void{
    if (!Types.ObjectId.isValid(id)) {
        throw new NotFoundException(`Id "${id}" não encontrado`);
    }
}