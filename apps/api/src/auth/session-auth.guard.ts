import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthService, type EditorialUser, SESSION_COOKIE } from "./auth.service";

export type EditorialRequest = {
  headers: { cookie?: string };
  editorialUser: EditorialUser;
};

function readCookie(cookieHeader: string | undefined, name: string): string {
  if (!cookieHeader) return "";
  const prefix = `${name}=`;
  const item = cookieHeader.split(";").find((part) => part.trim().startsWith(prefix));
  return item ? decodeURIComponent(item.trim().slice(prefix.length)) : "";
}

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<EditorialRequest>();
    const token = readCookie(request.headers.cookie, SESSION_COOKIE);
    if (!token) throw new UnauthorizedException("ابتدا وارد پنل شوید");
    request.editorialUser = await this.authService.getUserFromToken(token);
    return true;
  }
}
