import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { TokenService } from 'src/Token/token.service';
import { TypeToken } from 'src/common/enums/typeToken.enum';

@Injectable()
export class AuthRefreshGuard implements CanActivate {
  constructor(private tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    const refreshToken = await this.tokenService.findTokenByToken(
      token,
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
    request['id'] = refreshToken.user.id;
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    return request.cookies['refreshToken']
  }

  private isTokenExpired(expiresAt: Date): boolean {
    const currentDate = new Date();
    return expiresAt <= currentDate;
  }
}
