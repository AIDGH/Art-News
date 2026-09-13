import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import type { EnvironmentVariables } from "../config/environment";
import { AuthService, SESSION_COOKIE } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { type EditorialRequest, SessionAuthGuard } from "./session-auth.guard";

type CookieResponse = {
  cookie: (name: string, value: string, options: Record<string, unknown>) => void;
  clearCookie: (name: string, options: Record<string, unknown>) => void;
};

@Controller("auth")
@ApiTags("Editorial authentication")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService<EnvironmentVariables, true>,
  ) {}

  @Post("login")
  @ApiOperation({ summary: "Sign in to the editorial panel" })
  @ApiOkResponse({ description: "Authenticated editorial user" })
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) response: CookieResponse,
  ) {
    const { user, token, expiresAt } = await this.authService.login(
      body.email,
      body.password,
    );
    response.cookie(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure:
        this.configService.get("NODE_ENV", { infer: true }) === "production",
      expires: expiresAt,
      path: "/",
    });
    return { data: user };
  }

  @Post("logout")
  @ApiOperation({ summary: "Sign out of the editorial panel" })
  logout(@Res({ passthrough: true }) response: CookieResponse) {
    response.clearCookie(SESSION_COOKIE, { path: "/" });
    return { data: { success: true } };
  }

  @Get("me")
  @UseGuards(SessionAuthGuard)
  @ApiOperation({ summary: "Get the current editorial user" })
  me(@Req() request: EditorialRequest) {
    return { data: request.editorialUser };
  }
}
