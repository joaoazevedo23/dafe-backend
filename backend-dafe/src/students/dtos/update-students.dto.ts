import { PartialType } from "@nestjs/mapped-types";
import { CreateStudentsDTO } from "./create-students.dto";

export class UpdateStudentsDTO extends PartialType(CreateStudentsDTO) {}
