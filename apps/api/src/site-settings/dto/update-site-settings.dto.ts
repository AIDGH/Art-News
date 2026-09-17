import { IsString, Matches, MaxLength } from "class-validator";

export class UpdateSiteSettingsDto {
  @IsString()
  @MaxLength(300)
  @Matches(/\S/, { message: "متن فوتر نمی‌تواند خالی باشد" })
  footerDescription!: string;

  @IsString()
  @MaxLength(6000)
  aboutBody!: string;
}
