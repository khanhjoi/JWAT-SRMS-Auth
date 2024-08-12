import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import configEnv from '../../../config-env';
import { RefreshTokenService } from 'src/RefreshToken/refreshToken.service';

@Injectable()
export class AuthRefreshGuard implements CanActivate {
  constructor(private tokenService: RefreshTokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    const email = request.headers['email'];

    if (!token) {
      throw new UnauthorizedException();
    }
    
    const refreshToken = await this.tokenService.findTokenWithEmail(email);
    
    if (this.isTokenExpired(refreshToken.expiresAt)) {
      console.log('first expired')
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
