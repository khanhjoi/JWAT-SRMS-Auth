import { TypeToken } from 'src/common/enums/typeToken.enum';
import { MockType } from 'test/common/mockType.interface.test';

import { DeleteResult } from 'typeorm';
import { TokenRepository } from '@/Token/token.repository';
import { Token } from '@/Token/entity/token.entity';
import { CreateTokenDto } from '@/Token/dto/request/create-token.dto';
import { mockListToken, mockToken } from './token.data.mock';

export const mockTokenRepository: MockType<TokenRepository> = {
  findTokenWithToken: jest.fn(
    async (tokenDTO: string, typeToken: TypeToken): Promise<Token> => {
      const token = mockListToken.find((token) => token.token === tokenDTO);
      return Promise.resolve(token);
    },
  ),
  findTokenWithId: jest.fn(
    async (tokenId: string, typeToken: TypeToken): Promise<Token> => {
      const token = mockListToken.find((token) => token.id === tokenId);
      return Promise.resolve(token);
    },
  ),
  findTokenWithUserId: jest.fn(
    async (userId: string, typeToken: TypeToken): Promise<Token> => {
      const token = mockListToken.find((token) => token.user.id === userId);
      return Promise.resolve(token);
    },
  ),
  createToken: jest.fn(
    async (createTokenDto: CreateTokenDto): Promise<Token> => {
      return Promise.resolve({
        ...mockToken,
        token: createTokenDto.token,
        type: createTokenDto.type,
      });
    },
  ),
  updateToken: jest.fn(async (token: Token): Promise<Token> => {
    return Promise.resolve({ ...mockToken, ...token }); // return updated token
  }),
  deleteToken: jest.fn(async (token: Token): Promise<DeleteResult> => {
    return Promise.resolve({ affected: 1 } as DeleteResult); // simulate successful deletion
  }),
};
