import { IsString, Matches, MaxLength, ValidateIf } from "class-validator";

export class UpdateSiteSettingsDto {
  @IsString()
  @MaxLength(300)
  @Matches(/\S/, { message: "متن فوتر نمی‌تواند خالی باشد" })
  footerDescription!: string;

  @IsString()
  @MaxLength(6000)
  aboutBody!: string;

  @ValidateIf((_object, value) => value !== undefined)
  @IsString()
  @MaxLength(1200)
  @Matches(/\S/, { message: "متن اکران نیوز نمی‌تواند خالی باشد" })
  ecranPromoText?: string;
}
