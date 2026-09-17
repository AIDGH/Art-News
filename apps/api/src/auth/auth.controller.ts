import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthService, SESSION_COOKIE } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { type EditorialRequest, SessionAuthGuard } from "./session-auth.guard";

type CookieResponse = {
  cookie: (name: string, value: string, options: Record<string, unknown>) => void;
  clearCookie: (name: string, options: Record<string, unknown>) => void;
};

type CookieRequest = {
  headers: Record<string, string | string[] | undefined>;
  protocol?: string;
};

function isSecureRequest(request: CookieRequest): boolean {
  const forwardedHeader = request.headers["x-forwarded-proto"];
  const forwardedProtocol = Array.isArray(forwardedHeader)
    ? forwardedHeader[0]
    : forwardedHeader?.split(",")[0]?.trim();
  return forwardedProtocol === "https" || request.protocol === "https";
}

@Controller("auth")
@ApiTags("Editorial authentication")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @ApiOperation({ summary: "Sign in to the editorial panel" })
  @ApiOkResponse({ description: "Authenticated editorial user" })
  async login(
    @Body() body: LoginDto,
    @Req() request: CookieRequest,
    @Res({ passthrough: true }) response: CookieResponse,
  ) {
    const { user, token, expiresAt } = await this.authService.login(
      body.email,
      body.password,
    );
    response.cookie(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: isSecureRequest(request),
      expires: expiresAt,
      path: "/",
    });
    return { data: user };
  }

  @Post("logout")
  @ApiOperation({ summary: "Sign out of the editorial panel" })
  logout(
    @Req() request: CookieRequest,
    @Res({ passthrough: true }) response: CookieResponse,
  ) {
    response.clearCookie(SESSION_COOKIE, {
      httpOnly: true,
      sameSite: "lax",
      secure: isSecureRequest(request),
      path: "/",
    });
    return { data: { success: true } };
  }

  @Get("me")
  @UseGuards(SessionAuthGuard)
  @ApiOperation({ summary: "Get the current editorial user" })
  me(@Req() request: EditorialRequest) {
    return { data: request.editorialUser };
  }
}
