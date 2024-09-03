import { HttpException, Injectable } from '@nestjs/common';
import { TokenRepository } from './token.repository';
import { UserService } from 'src/user/user.service';
import { DeleteResult } from 'typeorm';
import { Token } from './entity/token.entity';
import { TypeToken } from 'src/common/enums/typeToken.enum';
import { TimeToken } from 'src/common/enums/timeToken.enum';
import { NotFoundException } from '@khanhjoi/protos/dist/errors/http';
import { AuthErrorCode } from '@khanhjoi/protos/dist/errors/AuthError.enum';

@Injectable()
export class TokenService {
  constructor(
    private tokenRepository: TokenRepository,
    private userRepo: UserService,
  ) {}

  async findTokenByToken(tokenDto: string, typeToken:TypeToken): Promise<Token> {
    const token = await this.tokenRepository.findTokenWithToken(
      tokenDto,
      typeToken,
    );
    return token;
  }

  async findTokenOfUserId(
    userId: string,
    typeToken: TypeToken,
  ): Promise<Token> {
    const refresh = await this.tokenRepository.findTokenWithUserId(
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

  /**
   * Create a refresh token
   * @param userId first parameter
   * @param token second parameter
   * @returns entity @Token
   */
  async createRefreshToken(userId: string, token: string): Promise<Token> {
    const user = await this.userRepo.findUserById(userId);

    const newToken = await this.tokenRepository.createToken({
      token: token,
      expiresAt: TimeToken.REFRESH_TOKEN,
      type: TypeToken.REFRESH_TOKEN,
      user: user,
    });

    return newToken;
  }

  /**
   * Create a reset password token
   * @param userId
   * @param token
   * @returns entity @Token
   */
  async createResetToken(userId: string, token: string): Promise<Token> {
    const user = await this.userRepo.findUserById(userId);

    const newToken = await this.tokenRepository.createToken({
      token: token,
      expiresAt: TimeToken.RESET_PASSWORD,
      type: TypeToken.RESET_PASSWORD,
      user: user,
    });

    return newToken;
  }

  async updateRefreshToken(tokenId: string, newToken?: string): Promise<Token> {
    const token = await this.tokenRepository.findTokenWithId(
      tokenId,
      TypeToken.REFRESH_TOKEN,
    );

    token.expiresAt = new Date(Date.now() + TimeToken.REFRESH_TOKEN);
    // token.token = newToken ? newToken : token.token; clear old token

    await this.tokenRepository.updateToken(token);

    return token;
  }

  async deleteRefreshToken(tokenId: string): Promise<DeleteResult> {
    const tokenIsExit = await this.tokenRepository.findTokenWithId(
      tokenId,
      TypeToken.REFRESH_TOKEN,
    );

    if (!tokenIsExit) {
      throw new NotFoundException(
        'Token is not available',
        AuthErrorCode.UNAUTHORIZED_ACCESS,
      );
    }

    const tokenDeleted = await this.tokenRepository.deleteToken(tokenIsExit);

    return tokenDeleted;
  }

  async deleteResetToken(tokenId: string): Promise<DeleteResult> {
    const tokenIsExit = await this.tokenRepository.findTokenWithId(
      tokenId,
      TypeToken.RESET_PASSWORD,
    );

    if (!tokenIsExit) {
      throw new NotFoundException(
        'Token is not available',
        AuthErrorCode.UNAUTHORIZED_ACCESS,
      );
    }

    const tokenDelete = await this.tokenRepository.deleteToken(tokenIsExit);

    return tokenDelete;
  }
}
