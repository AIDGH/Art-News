import { plainToInstance } from "class-transformer";
import { UpdateArticleDto } from "./update-article.dto";

describe("UpdateArticleDto", () => {
  it("preserves omitted publication, source, tag and homepage fields", () => {
    const dto = plainToInstance(UpdateArticleDto, { title: "Updated headline" });
    expect(dto.title).toBe("Updated headline");
    for (const key of ["status", "tags", "sources", "featured", "featuredOrder"] as const) {
      expect(dto[key]).toBeUndefined();
    }
  });

  it("retains explicit values including false, zero and empty arrays", () => {
    const dto = plainToInstance(UpdateArticleDto, {
      status: "PUBLISHED", tags: [], sources: [], featured: false, featuredOrder: 0,
    });
    expect(dto.status).toBe("PUBLISHED");
    expect(dto.tags).toEqual([]);
    expect(dto.sources).toEqual([]);
    expect(dto.featured).toBe(false);
    expect(dto.featuredOrder).toBe(0);
  });
});
