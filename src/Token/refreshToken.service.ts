import { HttpException, Injectable } from '@nestjs/common';
import { RefreshRepository } from './refreshToken.repository';
import { UserService } from 'src/user/user.service';
import { DeleteResult } from 'typeorm';
import { Token } from './entity/token.entity';

@Injectable()
export class RefreshTokenService {
  constructor(
    private refreshRepo: RefreshRepository,
    private userRepo: UserService,
  ) {}

  async findTokenOfUserId(userId: string): Promise<Token> {
    const refresh = await this.refreshRepo.findRefreshTokenWithUserId(userId);
    return refresh;
  }

  async findTokenWithEmail(email: string): Promise<Token> {
    const user = await this.userRepo.findUserByEmail(email);

    const refresh = await this.findTokenOfUserId(user.id);

    return refresh;
  }

  async createRefreshToken(
    tokenId: string,
    userId: string,
  ): Promise<Token> {
    const user = await this.userRepo.findUserById(userId);

    const newToken = await this.refreshRepo.createRefreshToken({
      id: tokenId,
      user: user,
    });

    return newToken;
  }

  async updateRefreshToken(tokenId: string): Promise<Token> {
    const token = await this.refreshRepo.findRefreshTokenWithTokenId(tokenId);

    token.expiresAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

    await this.refreshRepo.updateRefreshToken(token);

    return token;
  }

  async deleteRefreshToken(tokenId: string): Promise<DeleteResult> {
    const token = await this.refreshRepo.deleteRefreshToken(tokenId);

    return token;
  }
}
