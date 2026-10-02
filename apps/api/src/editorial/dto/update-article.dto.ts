import { PartialType } from "@nestjs/swagger";
import { CreateArticleDto } from "./create-article.dto";
import type { PublicationStatus } from "../../generated/prisma/enums";
import type { ArticleSourceDto } from "./article-source.dto";

export class UpdateArticleDto extends PartialType(CreateArticleDto) {
  // Creation defaults must not become implicit PATCH values.
  status?: PublicationStatus = undefined;
  tags?: string[] = undefined;
  sources?: ArticleSourceDto[] = undefined;
  featured?: boolean = undefined;
  featuredOrder?: number = undefined;
}
