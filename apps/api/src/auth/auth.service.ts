import { createHmac, timingSafeEqual } from "node:crypto";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { UserRole } from "../generated/prisma/enums";
import type { EnvironmentVariables } from "../config/environment";
import { PrismaService } from "../database/prisma.service";
import { verifyPassword } from "./password";

export const SESSION_COOKIE = "art_news_session";

export type EditorialUser = {
  id: string;
  email: string;
  username: string;
  displayName: string;
  role: UserRole;
};

type SessionPayload = {
  sub: string;
  exp: number;
};

@Injectable()
export class AuthService {
  private readonly sessionSecret: string;
  private readonly sessionTtlHours: number;

  constructor(
    private readonly prisma: PrismaService,
    configService: ConfigService<EnvironmentVariables, true>,
  ) {
    this.sessionSecret = configService.get("SESSION_SECRET", { infer: true });
    this.sessionTtlHours = configService.get("SESSION_TTL_HOURS", {
      infer: true,
    });
  }

  async login(email: string, password: string): Promise<{
    user: EditorialUser;
    token: string;
    expiresAt: Date;
  }> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        role: true,
        passwordHash: true,
      },
    });

    if (!user || !verifyPassword(password, user.passwordHash)) {
      throw new UnauthorizedException("ایمیل یا رمز عبور درست نیست");
    }

    const expiresAt = new Date(Date.now() + this.sessionTtlHours * 3_600_000);
    const token = this.signSession({
      sub: user.id,
      exp: Math.floor(expiresAt.getTime() / 1000),
    });
    const { passwordHash: _, ...editorialUser } = user;

    return { user: editorialUser, token, expiresAt };
  }

  async getUserFromToken(token: string): Promise<EditorialUser> {
    const payload = this.verifySession(token);
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        role: true,
      },
    });

    if (!user) throw new UnauthorizedException("نشست معتبر نیست");
    return user;
  }

  private signSession(payload: SessionPayload): string {
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
      "base64url",
    );
    const signature = createHmac("sha256", this.sessionSecret)
      .update(encodedPayload)
      .digest("base64url");
    return `${encodedPayload}.${signature}`;
  }

  private verifySession(token: string): SessionPayload {
    const [encodedPayload, signature] = token.split(".");
    if (!encodedPayload || !signature) {
      throw new UnauthorizedException("نشست معتبر نیست");
    }

    const expected = createHmac("sha256", this.sessionSecret)
      .update(encodedPayload)
      .digest();
    const actual = Buffer.from(signature, "base64url");
    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
      throw new UnauthorizedException("نشست معتبر نیست");
    }

    try {
      const payload = JSON.parse(
        Buffer.from(encodedPayload, "base64url").toString("utf8"),
      ) as SessionPayload;
      if (!payload.sub || payload.exp <= Math.floor(Date.now() / 1000)) {
        throw new Error("Expired session");
      }
      return payload;
    } catch {
      throw new UnauthorizedException("نشست معتبر نیست");
    }
  }
}
