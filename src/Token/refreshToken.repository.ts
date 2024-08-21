import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DeleteResult, Repository } from 'typeorm';
import { CreateTokenDto } from './dto/request/create-token.dto';
import { UpdateTokenDto } from './dto/request/update-token.dto';
import { Token } from './entity/token.entity';

@Injectable()
export class RefreshRepository {
  constructor(
    @InjectRepository(Token)
    private refreshRepository: Repository<Token>,
  ) {}

  async findRefreshTokenWithTokenId(tokenId: string): Promise<Token> {
    try {
      const token = await this.refreshRepository.findOne({
        where: {
          id: tokenId,
        },
      });
      return token;
    } catch (error) {
      throw new HttpException(
        'Find Refresh Token Failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findRefreshTokenWithUserId(userId: string): Promise<Token> {
    try {
      const token = await this.refreshRepository.findOne({
        where: {
          user: {
            id: userId,
          },
        },
      });
      return token;
    } catch (error) {
      throw new HttpException(
        'Find Refresh Token Failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createRefreshToken(
    createTokenDto: CreateTokenDto,
  ): Promise<Token> {
    try {
      const newToken = await this.refreshRepository.save({
        id: createTokenDto.id,
        expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        user: createTokenDto.user,
      });
      return newToken;
    } catch (error) {
      throw new HttpException(
        'Create Refresh Token Failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateRefreshToken(token: Token): Promise<Token> {
    try {
      const tokenUpdate = await this.refreshRepository.save(token);
      return tokenUpdate;
    } catch (error) {
      throw new HttpException(
        'Update Refresh Token Failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteRefreshToken(tokenId: string): Promise<DeleteResult> {
    try {
      const token = await this.refreshRepository.delete({ id: tokenId });
      return token;
    } catch (error) {
      throw new HttpException(
        'Delete Refresh Token Failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
