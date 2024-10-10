import { Token } from '@/Token/entity/token.entity';
import { TypeToken } from '@common/enums/typeToken.enum';
import { InjectRepoMock } from 'test/common/mockType.interface.test';

export const mockToken: Token = {
  id: '1',
  token: 'mock-token',
  type: TypeToken.REFRESH_TOKEN,
  expiresAt: new Date('2024-10-10T14:25:37.873Z'),
  user: {
    id: '1132e528-c197-48a9-828d-004f1c52b028',
    email: 'userMaster@gmail.com',
    firstName: 'User',
    lastName: 'Master',
    password: '',
    tokens: null,
    createdAt: new Date('2024-10-02T11:55:11.603Z'),
    isDelete: false,
    role: null,
  },
};

export const mockTokens: Token[] = [mockToken];

// This mock implementation should handle the functions you need for the repository.
export const tokenInjectRepoMock = InjectRepoMock<Token>(mockTokens);
