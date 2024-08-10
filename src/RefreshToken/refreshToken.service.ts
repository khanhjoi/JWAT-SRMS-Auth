import { HttpException, Injectable } from '@nestjs/common';
import { RefreshRepository } from './refreshToken.repository';
import { RefreshToken } from './entity/refresh-token.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class RefreshTokenService {
  constructor(
    private refreshRepo: RefreshRepository,
    private userRepo: UserService,
  ) {}

  async findTokenOfUserId(userId: string): Promise<RefreshToken> {
    const refresh = await this.refreshRepo.findRefreshTokenWithUserId(userId);
    return refresh;
  }

  async createRefreshToken(
    tokenId: string,
    userId: string,
  ): Promise<RefreshToken> {
    const user = await this.userRepo.findUserById(userId);

    const newToken = await this.refreshRepo.createRefreshToken({
      id: tokenId,
      user: user,
    });

    return newToken;
  }

  async updateRefreshToken(tokenId: string): Promise<RefreshToken> {
    const token = await this.refreshRepo.findRefreshTokenWithTokenId(tokenId);

    token.expiresAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

    await this.refreshRepo.updateRefreshToken(token);

    return token;
  }
}
