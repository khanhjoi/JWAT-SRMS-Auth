import { MockType } from 'test/common/mockType.interface.test';
import { TypeToken } from 'src/common/enums/typeToken.enum';
import { DeleteResult } from 'typeorm';
import { NotFoundException } from '@khanhjoi/protos/dist/errors/http';
import { AuthErrorCode } from '@khanhjoi/protos/dist/errors/AuthError.enum';
import { TokenService } from '@/Token/token.service';
import { mockListToken, mockToken } from './token.data.mock';
import { Token } from '@/Token/entity/token.entity';
import { CreateTokenDto } from '@/Token/dto/request/create-token.dto';

export const mockTokenService: MockType<TokenService> = {
  findTokenByToken: jest.fn(
    async (tokenDto: string, typeToken: TypeToken): Promise<Token> => {
      return Promise.resolve(mockToken);
    },
  ),

  findTokenOfUserId: jest.fn(
    async (userId: string, typeToken: TypeToken): Promise<Token> => {
      // Mock logic to return a token for a user by userId and typeToken
      const token = mockListToken.find((token) => token.user.id === userId);
      return Promise.resolve(token);
    },
  ),

  findTokenWithEmail: jest.fn(
    async (email: string, typeToken: TypeToken): Promise<Token> => {
      // Mock logic to return a token for a user by email
      const token = mockListToken.find((token) => token.user.email === email);
      return Promise.resolve(token);
    },
  ),

  createRefreshToken: jest.fn(
    async (createTokenDto: CreateTokenDto): Promise<Token> => {
      return Promise.resolve({
        ...mockToken,
        token: createTokenDto.token,
        type: createTokenDto.type,
      });
    },
  ),

  createResetToken: jest.fn(
    async (userId: string, token: string): Promise<Token> => {
      // Mock logic to create a reset token
      return Promise.resolve({
        ...mockToken,
        token: token,
        type: TypeToken.RESET_PASSWORD,
      });
    },
  ),

  updateRefreshToken: jest.fn(async (tokenId: string): Promise<Token> => {
    return Promise.resolve({
      ...mockToken,
    });
  }),

  deleteRefreshToken: jest.fn(
    async (tokenId: string): Promise<DeleteResult> => {
      return Promise.resolve({ affected: 1 } as DeleteResult);
    },
  ),

  deleteResetToken: jest.fn(async (tokenId: string): Promise<DeleteResult> => {
    return Promise.resolve({ affected: 1 } as DeleteResult);
  }),
};
