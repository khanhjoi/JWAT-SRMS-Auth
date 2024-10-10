import { OffsetPaginationDto } from 'src/common/dto/offsetPagination.dto';
import { IOffsetPaginatedType } from 'src/common/interface/offsetPagination.interface';
import { User } from 'src/user/entity/user.entity';
import { UserRepository } from 'src/user/user.repository';
import { InjectRepoMock, MockType } from 'test/common/mockType.interface.test';
import { CreateUserDTO } from 'src/user/dto/create-user.dto';
import { RoleRepository } from '@/role/role.repository';
import { Role } from '@/role/entity/role.entity';
import { mockRole, mockRoles } from './role.data.mock';
import { NotFoundException } from '@nestjs/common';
import { CreateRoleDTO } from '@/role/dto/request/create-role.dto';

export const roleRepositoryMock: MockType<RoleRepository> = {
  findRoleById: jest.fn(
    async (
      roleId: string,
      select?: (keyof Role)[],
    ): Promise<Role | undefined> => {
      const role = mockRoles.find((role) => role.id === roleId);
      return role;
    },
  ),

  getRoleByUserId: jest.fn(
    async (userId: string, select?: (keyof Role)[]): Promise<Role> => {
      const role = mockRoles.find((role) =>
        role.users.some((user) => user.id === userId),
      );

      return Promise.resolve(role);
    },
  ),

  getRolesWithPagination: jest.fn(
    async (
      queryPagination: OffsetPaginationDto,
      select?: (keyof Role)[],
      relations?: (keyof Role)[],
    ): Promise<IOffsetPaginatedType<Role>> => {
      return Promise.resolve({
        data: mockRoles,
        totalCount: mockRoles.length,
      });
    },
  ),

  getRoles: jest.fn(async (): Promise<Role[]> => {
    return Promise.resolve(mockRoles);
  }),

  updateRole: jest.fn(async (role: Role): Promise<Role> => {
    return Promise.resolve({ ...mockRole, ...role });
  }),

  updateStatusRole: jest.fn(
    async (roleId: string, status: boolean): Promise<Role> => {
      return Promise.resolve({ ...mockRole, status: status });
    },
  ),

  createRole: jest.fn(async (createRoleDTO: CreateRoleDTO): Promise<Role> => {
    return Promise.resolve({ ...mockRole, ...createRoleDTO });
  }),

  deleteRole: jest.fn(async (role: Role): Promise<Role> => {
    return Promise.resolve(role);
  }),
};

export const roleInjectRepoMock = InjectRepoMock<Role>(mockRoles);
