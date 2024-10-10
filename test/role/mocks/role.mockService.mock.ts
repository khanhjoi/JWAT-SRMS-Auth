import { User } from 'src/user/entity/user.entity';
import { MockType } from 'test/common/mockType.interface.test';
import { CreateUserDTO } from 'src/user/dto/create-user.dto';
import { UserService } from '@user/user.service';
import { mockCreatedUser, mockListUser, mockUpdateUser } from 'test/user/mocks';
import { MockUser } from './role.data.mock';

export const userServiceMock: MockType<UserService> = {
  findUserByEmail: jest.fn(
    async (email: string): Promise<Omit<User | {}, 'password' | 'tokens'>> => {
      const user = mockListUser.find((user) => user.email === email);
      return user;
    },
  ),
  findUserById: jest.fn(
    async (id: string): Promise<Omit<User | {}, 'password' | 'tokens'>> => {
      const user = mockListUser.find((user) => user.id === id);
      return user;
    },
  ),
  findUsersWithRoleId: jest.fn(
    async (roleId: string): Promise<Omit<User, 'password' | 'tokens'>[]> => {
      const usersWithRoleId = mockListUser.filter(
        (user) => user.role?.id === roleId,
      );
      return usersWithRoleId;
    },
  ),
  createUser: jest.fn(
    async (input: CreateUserDTO): Promise<Omit<User, 'tokens' | 'role'>> => {
      return await Promise.resolve({ ...mockCreatedUser, ...input });
    },
  ),
  updateUser: jest.fn(
    async (input: MockUser): Promise<Omit<User, 'tokens' | 'role'>> => {
      return await Promise.resolve({ ...mockCreatedUser, ...input });
    },
  ),
  updateProfileUser: jest.fn(
    async (
      userId: string,
      input: MockUser,
    ): Promise<Omit<User, 'tokens' | 'role'>> => {
      return await Promise.resolve({ ...mockUpdateUser, ...input });
    },
  ),
};
