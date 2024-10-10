import { Token } from '@/Token/entity/token.entity';
import { TypeToken } from '@khanhjoi/protos';
import { MockRoleType } from 'test/user/mocks';

export const mockToken: Token = {
  id: 'e800d959-8a2e-41d8-b228-9f442e38a0b2',
  token: 'mock-token',
  type: TypeToken.REFRESH_TOKEN,
  expiresAt: new Date(Date.now() + 3600000), // 1 hour later
  user: {
    id: '1132e528-c197-48a9-828d-004f1c52b028',
    email: 'userMaster@gmail.com',
    firstName: 'User',
    lastName: 'Master',
    password: '',
    tokens: null,
    createdAt: new Date('2024-10-02T11:55:11.603Z'),
    isDelete: false,
    role: {
      id: '93d13875-ae1d-4283-a877-ab1eac71e066',
      title: 'User Manager',
      description: 'only available with manager user',
      active: true,
      createdAt: new Date('2024-09-19T12:13:20.329Z'),
    } as MockRoleType,
  },
};

export const mockListToken: Token[] = [
  {
    id: '1',
    token: 'mock-token',
    type: TypeToken.REFRESH_TOKEN,
    expiresAt: new Date(Date.now() + 3600000), // 1 hour later
    user: {
      id: '1132e528-c197-48a9-828d-004f1c52b028',
      email: 'userMaster@gmail.com',
      firstName: 'User',
      lastName: 'Master',
      password: '',
      tokens: null,
      createdAt: new Date('2024-10-02T11:55:11.603Z'),
      isDelete: false,
      role: {
        id: '93d13875-ae1d-4283-a877-ab1eac71e066',
        title: 'User Manager',
        description: 'only available with manager user',
        active: true,
        createdAt: new Date('2024-09-19T12:13:20.329Z'),
      } as MockRoleType,
    },
  },
  {
    id: '2',
    token: 'mock-token2',
    type: TypeToken.REFRESH_TOKEN,
    expiresAt: new Date(Date.now() + 3600000), // 1 hour later
    user: {
      id: '402f45c6-c0dc-408f-8e16-4ffe34ebfedd',
      firstName: 'test',
      lastName: 'test',
      email: 'test@gmail.com',
      isDelete: false,
      password: '',
      tokens: null,
      createdAt: new Date('2024-10-03T11:55:11.603Z'),
      role: null, // User without a role
    },
  },
  {
    id: '3',
    token: 'mock-token3',
    type: TypeToken.REFRESH_TOKEN,
    expiresAt: new Date(Date.now() + 3600000), // 1 hour later
    user: null,
  },
  {
    id: '3',
    token: 'mock-token4',
    type: TypeToken.REFRESH_TOKEN,
    expiresAt: new Date(Date.now() + 3600000), // 1 hour later
    user: null,
  },
];
