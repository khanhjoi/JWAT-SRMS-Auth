import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  Type,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DeleteResult, Repository } from 'typeorm';
import { CreateTokenDto } from './dto/request/create-token.dto';
import { Token } from './entity/token.entity';
import { TypeToken } from 'src/common/enums/typeToken.enum';

@Injectable()
export class TokenRepository {
  private readonly logger = new Logger(TokenRepository.name);
  constructor(
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
  ) {}

  async findTokenWithToken(
    tokenDTO: string,
    typeToken: TypeToken,
  ): Promise<Token> {
    try {
      const token = await this.tokenRepository.findOne({
        where: {
          token: tokenDTO,
          type: typeToken,
        },
        relations: ['user'],
        select: {
          user: {
            id: true,
          },
        },
      });
      return token;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        'Find Refresh Token Failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Find token with given:
   * @param tokenId id of token
   * @param typeToken type of token
   * @returns entity @Token
   */
  async findTokenWithId(tokenId: string, typeToken: TypeToken): Promise<Token> {
    try {
      const token = await this.tokenRepository.findOne({
        where: {
          id: tokenId,
          type: typeToken,
        },
      });
      return token;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        'Find Refresh Token Failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Find token with the given:
   * @param userId
   * @param typeToken
   * @returns entity @Token
   */
  async findTokenWithUserId(
    userId: string,
    typeToken: TypeToken,
  ): Promise<Token> {
    try {
      const tokent = await this.tokenRepository.findOne({
        where: {
          id: "d2a99286-8851-466b-b7ab-cc3e0133bae6"
        }
      })

      console.log(tokent)
      const token = await this.tokenRepository.findOne({
        where: {
          type: typeToken,
          user: {
            id: userId,
          },
        },
        relations: {
          user: true,
        },
      });
    

      return token;
    } catch (error) {
      console.log(error)
      this.logger.error(error);
      throw new HttpException(
        'Find Refresh Token Failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Create a new Token of user
   * @param createTokenDto
   * @returns Entity @Token
   */
  async createToken(createTokenDto: CreateTokenDto): Promise<Token> {
    try {
      const newToken = await this.tokenRepository.save({
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

  /**
   * update the token with given:
   * @param token Token entity need to be updated
   * @returns entity Tokens
   */
  async updateToken(token: Token): Promise<Token> {
    try {
      const tokenUpdate = await this.tokenRepository.save(token);
      return tokenUpdate;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        'Update Refresh Token Failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Delete a token by given
   * @param token : Entity of the Token to delete
   * @returns DeleteResult<Token>
   */
  async deleteToken(token: Token): Promise<DeleteResult> {
    try {
      const tokenDeleted = await this.tokenRepository.delete({
        id: token.id,
        type: token.type,
      });
      return tokenDeleted;
    } catch (error) {
      this.logger.error(error);

      throw new HttpException(
        'Delete Refresh Token Failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
