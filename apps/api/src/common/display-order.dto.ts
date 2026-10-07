import { ArrayMaxSize, ArrayUnique, IsArray, IsUUID } from "class-validator";
import { ConflictException } from "@nestjs/common";

export class DisplayOrderDto {
  @IsArray()
  @ArrayUnique()
  @ArrayMaxSize(1000)
  @IsUUID("all", { each: true })
  ids!: string[];
}

export function assertCompleteOrder(ids: string[], currentIds: string[]) {
  const current = new Set(currentIds);
  if (ids.length !== current.size || new Set(ids).size !== ids.length || ids.some((id) => !current.has(id))) {
    throw new ConflictException("فهرست تغییر کرده است؛ دوباره دریافت کنید و چینش را ذخیره کنید.");
  }
}
