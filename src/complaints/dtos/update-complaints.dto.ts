import { PartialType } from "@nestjs/mapped-types";
import { CreateComplaintsDTO } from "./create-complaints.dto";

export class UpdateComplaintsDTO extends PartialType(CreateComplaintsDTO) {}
