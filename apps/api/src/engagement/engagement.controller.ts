import { randomBytes } from "node:crypto";
import {
  Body, Controller, ForbiddenException, Get, Param, Patch, Post,
  Query, Req, Res, UseGuards,
} from "@nestjs/common";
import { SessionAuthGuard } from "../auth/session-auth.guard";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { ModerateCommentDto } from "./dto/moderate-comment.dto";
import { EngagementService } from "./engagement.service";

const VISITOR_COOKIE = "cinema_visitor";

type VisitorRequest = {
  headers: Record<string, string | undefined>;
  protocol?: string;
};
type VisitorResponse = {
  cookie: (name: string, value: string, options: Record<string, unknown>) => void;
};

function readVisitor(request: VisitorRequest): string | undefined {
  const value = request.headers.cookie?.split(";").map((part) => part.trim())
    .find((part) => part.startsWith(`${VISITOR_COOKIE}=`))?.slice(VISITOR_COOKIE.length + 1);
  return value && /^[a-f0-9]{64}$/.test(value) ? value : undefined;
}

function ensureSameOrigin(request: VisitorRequest): void {
  const origin = request.headers.origin;
  const host = request.headers["x-forwarded-host"] || request.headers.host;
  if (origin) {
    try {
      if (host && new URL(origin).host === host) return;
    } catch {}
    throw new ForbiddenException("مبدأ درخواست معتبر نیست");
  }
}

function ensureVisitor(request: VisitorRequest, response: VisitorResponse): string {
  ensureSameOrigin(request);
  const existing = readVisitor(request);
  if (existing) return existing;
  const id = randomBytes(32).toString("hex");
  response.cookie(VISITOR_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: request.headers["x-forwarded-proto"] === "https" || request.protocol === "https",
    maxAge: 365 * 24 * 60 * 60 * 1000,
    path: "/",
  });
  return id;
}

@Controller("articles/:slug/engagement")
export class EngagementController {
  constructor(private readonly service: EngagementService) {}

  @Get()
  find(@Param("slug") slug: string, @Req() request: VisitorRequest) {
    return this.service.findPublic(slug, readVisitor(request));
  }

  @Post("comments")
  createComment(
    @Param("slug") slug: string, @Body() body: CreateCommentDto,
    @Req() request: VisitorRequest, @Res({ passthrough: true }) response: VisitorResponse,
  ) {
    return this.service.createComment(slug, body, ensureVisitor(request, response));
  }

  @Post("likes")
  likeArticle(
    @Param("slug") slug: string, @Req() request: VisitorRequest,
    @Res({ passthrough: true }) response: VisitorResponse,
  ) {
    return this.service.likeArticle(slug, ensureVisitor(request, response));
  }

  @Post("comments/:commentId/likes")
  likeComment(
    @Param("slug") slug: string, @Param("commentId") commentId: string,
    @Req() request: VisitorRequest, @Res({ passthrough: true }) response: VisitorResponse,
  ) {
    return this.service.likeComment(slug, commentId, ensureVisitor(request, response));
  }
}

@Controller("editorial/comments")
@UseGuards(SessionAuthGuard)
export class EditorialCommentsController {
  constructor(private readonly service: EngagementService) {}

  @Get()
  find(@Query("status") status?: string) {
    return this.service.listForModeration(status);
  }

  @Patch(":id")
  moderate(@Param("id") id: string, @Body() body: ModerateCommentDto) {
    return this.service.moderate(id, body.status);
  }
}
