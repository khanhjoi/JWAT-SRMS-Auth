import { HttpException, Injectable } from '@nestjs/common';
import { RefreshRepository } from './refreshToken.repository';
import { UserService } from 'src/user/user.service';
import { DeleteResult } from 'typeorm';
import { Token } from './entity/token.entity';
import { TypeToken } from 'src/common/enums/typeToken.enum';
import { TimeToken } from 'src/common/enums/timeToken.enum';

@Injectable()
export class RefreshTokenService {
  constructor(
    private refreshRepo: RefreshRepository,
    private userRepo: UserService,
  ) {}

  async findTokenOfUserId(
    userId: string,
    typeToken: TypeToken,
  ): Promise<Token> {
    const refresh = await this.refreshRepo.findRefreshTokenWithUserId(
      userId,
      typeToken,
    );
    return refresh;
  }

  async findTokenWithEmail(
    email: string,
    typeToken: TypeToken,
  ): Promise<Token> {
    const user = await this.userRepo.findUserByEmail(email);

    const refresh = await this.findTokenOfUserId(user.id, typeToken);

    return refresh;
  }

  async createRefreshToken(userId: string, token: string): Promise<Token> {
    const user = await this.userRepo.findUserById(userId);

    const newToken = await this.refreshRepo.createToken({
      token: token,
      expiresAt: TimeToken.REFRESH_TOKEN,
      type: TypeToken.REFRESH_TOKEN,
      user: user,
    });

    return newToken;
  }

  async createResetToken(token: string, userId: string): Promise<Token> {
    const user = await this.userRepo.findUserById(userId);

    const newToken = await this.refreshRepo.createToken({
      token: token,
      expiresAt: TimeToken.RESET_PASSWORD,
      type: TypeToken.RESET_PASSWORD,
      user: user,
    });

    return newToken;
  }

  // async createValidationToken(token: string, userId: string): Promise<Token> {
  //   const user = await this.userRepo.findUserById(userId);

  //   const newToken = await this.refreshRepo.createRefreshToken({
  //     token: token,
  //     user: user,
  //   });

  //   return newToken;
  // }

  async updateRefreshToken(tokenId: string, newToken?: string): Promise<Token> {
    const token = await this.refreshRepo.findToken(
      tokenId,
      TypeToken.REFRESH_TOKEN,
    );

    token.expiresAt = new Date(Date.now() + TimeToken.REFRESH_TOKEN);
    token.token = newToken ? newToken : token.token;

    await this.refreshRepo.updateToken(token);

    return token;
  }

  async deleteRefreshToken(tokenId: string): Promise<DeleteResult> {
    const token = await this.refreshRepo.deleteToken(
      tokenId,
      TypeToken.REFRESH_TOKEN,
    );

    return token;
  }
}
