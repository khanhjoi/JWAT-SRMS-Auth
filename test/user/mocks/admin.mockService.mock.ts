import { User } from 'src/user/entity/user.entity';
import { MockType } from 'test/common/mockType.interface.test';
import { AdminUserService } from '@user/admin.service';
import { UpdateUserByAdminDTO } from 'src/user/dto/update-user-by-admin.dto';
import { AssignRoleDto } from 'src/role/dto/request/assign-permission.dto';
import { IOffsetPaginatedType } from '@common/interface/offsetPagination.interface';
import { mockListUser } from './user.data.mock';

export const adminUserServiceMock: MockType<AdminUserService> = {
  findAllUserWithPagination: jest.fn(
    async (): Promise<IOffsetPaginatedType<User>> => {
      const mockUsers = mockListUser; // Create mock users
      return { data: mockUsers, totalCount: mockUsers.length };
    },
  ),
  updateUser: jest.fn(async (input: UpdateUserByAdminDTO): Promise<User> => {
    return new User(); // Return a mock user object
  }),
  deleteUser: jest.fn(async (userId: string): Promise<User> => {
    return new User(); // Return a mock user object for deleted user
  }),
  activeUser: jest.fn(async (userId: string): Promise<User> => {
    return new User(); // Return a mock user object for activated user
  }),
  assignRole: jest.fn(async (userId: string, roleId: string): Promise<User> => {
    return new User(); // Return a mock user object with assigned role
  }),
};
