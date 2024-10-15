import { IOffsetPaginatedType } from '@common/interface/offsetPagination.interface';
import { User } from 'src/user/entity/user.entity';

export type MockRoleType = Omit<User['role'], ''>;
export type MockUser = Omit<User, 'role' | 'tokens'>;

export const mockListUser: User[] = [
  {
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
  {
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
  {
    id: '20d64836-f81e-47a1-bab5-620e68f3c67c',
    firstName: 'test2',
    lastName: 'test2',
    email: 'test2@gmail.com',
    isDelete: false,
    password: '',
    tokens: null,
    createdAt: new Date('2024-11-03T11:55:11.603Z'),
    role: null,
  },
  {
    id: '34fcbdbb-d7cc-4145-a972-bbd9427f77c2',
    firstName: 'test3',
    lastName: 'test3',
    email: 'test3@gmail.com',
    isDelete: false,
    password: '',
    tokens: null,
    createdAt: new Date('2024-12-03T11:55:11.603Z'),
    role: null,
  },
  {
    id: '8effb395-d08e-4aaf-a745-0e4057eb14b0',
    firstName: 'test4',
    lastName: 'test4',
    email: 'test4@gmail.com',
    isDelete: true,
    password: '',
    tokens: null,
    createdAt: new Date('2024-13-03T11:55:11.603Z'),
    role: null,
  },
  {
    id: '839c0080-0da5-498b-9134-7145f8813757',
    firstName: 'test5',
    lastName: 'test5',
    email: 'test5@gmail.com',
    isDelete: true,
    password: '',
    tokens: null,
    createdAt: new Date('2024-14-03T11:55:11.603Z'),
    role: null,
  },
];

export const mockUsersPaginated: IOffsetPaginatedType<User> = {
  data: mockListUser,
  totalCount: mockListUser.length,
};

export const mockUserExitData: User = {
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
};

export const mockCreatedUser: User = {
  id: '1132e528-c197-48a9-828d-004f1c52b028',
  firstName: 'khanh',
  lastName: 'nguyen',
  createdAt: new Date('2024-09-10T09:47:22.187Z'),
  email: 'unitTest@gmail.com',
  isDelete: false,
  password: '',
  tokens: null,
  role: null,
};

export const mockUpdateUser: User | any = {
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
};
