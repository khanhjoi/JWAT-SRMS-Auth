import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DeleteResult, Repository } from 'typeorm';
import { CreateTokenDto } from './dto/request/create-token.dto';
import { Token } from './entity/token.entity';
import { TypeToken } from 'src/common/enums/typeToken.enum';

@Injectable()
export class RefreshRepository {
  constructor(
    @InjectRepository(Token)
    private refreshRepository: Repository<Token>,
  ) {}

  async findToken(tokenId: string, typeToken: TypeToken): Promise<Token> {
    try {
      const token = await this.refreshRepository.findOne({
        where: {
          id: tokenId,
          type: typeToken,
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

  async findRefreshTokenWithUserId(
    userId: string,
    typeToken: TypeToken,
  ): Promise<Token> {
    try {
      const token = await this.refreshRepository.findOne({
        where: {
          type: typeToken,
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

  async createToken(createTokenDto: CreateTokenDto): Promise<Token> {
    try {
      const newToken = await this.refreshRepository.save({
        type: createTokenDto.type,
        token: createTokenDto.token,
        expiresAt: new Date(Date.now() + createTokenDto.expiresAt),
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

  async updateToken(token: Token): Promise<Token> {
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

  async deleteToken(
    tokenId: string,
    typeToken: TypeToken,
  ): Promise<DeleteResult> {
    try {
      const token = await this.refreshRepository.delete({
        id: tokenId,
        type: typeToken,
      });
      return token;
    } catch (error) {
      throw new HttpException(
        'Delete Refresh Token Failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
