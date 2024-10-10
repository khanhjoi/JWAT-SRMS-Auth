import { OffsetPaginationDto } from 'src/common/dto/offsetPagination.dto';
import { IOffsetPaginatedType } from 'src/common/interface/offsetPagination.interface';
import { User } from 'src/user/entity/user.entity';
import { UserRepository } from 'src/user/user.repository';
import { InjectRepoMock, MockType } from 'test/common/mockType.interface.test';
import { mockCreatedUser, mockListUser, MockUser } from './user.data.mock';
import { CreateUserDTO } from 'src/user/dto/create-user.dto';
import { Repository } from 'typeorm';

export const userRepositoryMock: MockType<UserRepository> = {
  findAllUserWithPagination: jest.fn(
    async (
      userQueryPagination: OffsetPaginationDto,
      select?: (keyof User)[],
      relations?: (keyof User)[],
    ): Promise<IOffsetPaginatedType<Omit<User, 'password' | 'tokens'>>> => {
      const nodes = mockListUser;
      return await Promise.resolve({ data: nodes, totalCount: nodes.length });
    },
  ),
  findUserByEmail: jest.fn(
    async (email: string): Promise<Omit<User | {}, 'password' | 'tokens'>> => {
      const user = mockListUser.find((user) => user.email === email);
      return user;
    },
  ),
  findUserById: jest.fn(
    async (
      id: string,
    ): Promise<Omit<User | {}, 'password' | 'tokens'>> | null => {
      const user = mockListUser.find((user) => user.id === id);
      return user ? user : null;
    },
  ),
  findUsersWithRoleId: jest.fn(
    async (
      roleId: string,
    ): Promise<Omit<User, 'password' | 'tokens'>[]> | null => {
      const usersWithRoleId = mockListUser.filter(
        (user) => user.role?.id === roleId,
      );
      return usersWithRoleId;
    },
  ),
  createNewUser: jest.fn(
    async (input: CreateUserDTO): Promise<Omit<User, 'tokens' | 'role'>> => {
      return await Promise.resolve({ ...mockCreatedUser, ...input });
    },
  ),
  updateUser: jest.fn(
    async (input: MockUser): Promise<Omit<User, 'tokens' | 'role'>> => {
      return await Promise.resolve({ ...mockCreatedUser, ...input });
    },
  ),
};

export const userInjectRepoMock = InjectRepoMock<User>(mockListUser);
