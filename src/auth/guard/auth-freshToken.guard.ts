import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { RefreshTokenService } from 'src/Token/refreshToken.service';
import { TypeToken } from 'src/common/enums/typeToken.enum';

@Injectable()
export class AuthRefreshGuard implements CanActivate {
  constructor(private tokenService: RefreshTokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    const email = request.headers['email'];
    const refreshToken = await this.tokenService.findTokenWithEmail(
      email,
      TypeToken.REFRESH_TOKEN,
    );

    if (!token || !refreshToken) {
      throw new UnauthorizedException();
    }

    if (this.isTokenExpired(refreshToken.expiresAt)) {
      await this.tokenService.deleteRefreshToken(refreshToken.id);
      throw new UnauthorizedException('Refresh token is expired');
    }

    request['token'] = token;
    request['email'] = email;
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private isTokenExpired(expiresAt: Date): boolean {
    const currentDate = new Date();
    return expiresAt <= currentDate;
  }
}
