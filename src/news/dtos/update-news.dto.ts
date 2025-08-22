import { PartialType } from "@nestjs/mapped-types";
import { CreateNewsDTO } from "./create-news.dto";

export class UpdateNewsDTO extends PartialType(CreateNewsDTO) {}
