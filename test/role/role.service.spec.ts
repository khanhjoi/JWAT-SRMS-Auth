import { Test, TestingModule } from '@nestjs/testing';
import { PermissionRepository } from 'src/permission/permission.repository';
import { UserService } from 'src/user/user.service';
import { Action, CacheSharedService } from '@khanhjoi/protos';
import {
  BadRequestException,
  NotFoundException,
} from '@khanhjoi/protos/dist/errors/http';
import { RoleRepository } from '@/role/role.repository';
import { RoleService } from '@/role/role.service';
import { roleRepositoryMock } from './mocks/role.repository.mock';
import { OffsetPaginationDto } from '@common/dto/offsetPagination.dto';
import { IOffsetPaginatedType } from '@common/interface/offsetPagination.interface';
import { mockRole, mockRoles } from './mocks/role.data.mock';
import { Role } from '@/role/entity/role.entity';
import { ConfigModule } from '@nestjs/config';
import { AuthErrorCode } from '@khanhjoi/protos/dist/errors/AuthError.enum';
import { CreateRoleDTO } from '@/role/dto/request/create-role.dto';
import { UpdateRoleDTO } from '@/role/dto/request/update-role.dto';
import { mockListUser, mockUserExitData } from 'test/user/mocks';
import { Permission } from '@/permission/entity/permission.entity';
import { UserRepository } from '@user/user.repository';
import { userServiceMock } from './mocks/role.mockService.mock';

describe('RoleService', () => {
  let service: RoleService;
  let roleRepository: jest.Mocked<RoleRepository>;
  let permissionRepository: jest.Mocked<PermissionRepository>;
  let userService: UserService;
  let cacheService: CacheSharedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        RoleService,
        {
          provide: RoleRepository,
          useValue: roleRepositoryMock,
        },
        {
          provide: PermissionRepository,
          useValue: {
            findPermissionsWithIds: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: userServiceMock,
        },
        {
          provide: 'CACHE_SERVICE',
          useValue: {
            getValueByKey: jest.fn(),
            setValue: jest.fn(),
            deleteValue: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RoleService>(RoleService);
    roleRepository = module.get(RoleRepository);
    permissionRepository = module.get(PermissionRepository);
    userService = module.get<UserService>(UserService);
    cacheService = module.get('CACHE_SERVICE');
  });

  describe('getRolesWithPagination', () => {
    it('should return paginated roles', async () => {
      const queryPagination: OffsetPaginationDto = {
        limit: 6,
        page: 1,
      };

      const mockRolesResultPagination: IOffsetPaginatedType<Role> = {
        data: mockRoles,
        totalCount: mockRoles.length,
      };

      const result = await service.getRolesWithPagination(queryPagination);

      expect(result).toEqual(mockRolesResultPagination);
      expect(roleRepository.getRolesWithPagination).toHaveBeenCalledWith(
        queryPagination,
      );
      expect(roleRepository.getRolesWithPagination).toHaveBeenCalledTimes(1);
    });
  });

  describe('getRoles', () => {
    it('should return all roles', async () => {
      const result = await service.getRoles();

      expect(result).toEqual(mockRoles);
      expect(roleRepository.getRoles).toHaveBeenCalledTimes(1);
    });
  });

  describe('getRoleWithId', () => {
    it('should return a role when found', async () => {
      const result = await service.getRoleWithId(mockRole.id);

      expect(roleRepository.findRoleById).toHaveBeenCalledWith(mockRole.id);
      expect(roleRepository.findRoleById).toHaveBeenCalledTimes(1);
      expect(result.id).toEqual(mockRole.id);
    });

    it('should throw BadRequestException when role is not found', async () => {
      // Mock the role repository method to return null
      jest
        .spyOn(roleRepository, 'findRoleById')
        .mockRejectedValue(new Error('Role Not Found'));

      await expect(service.getRoleWithId('')).rejects.toThrow(
        new BadRequestException('Role Not Found', AuthErrorCode.DATABASE_ERROR),
      );
      expect(roleRepository.findRoleById).toHaveBeenCalledTimes(2);
      expect(roleRepository.findRoleById).toHaveBeenCalledWith('');
    });
  });

  describe('getPermissionOfRole', () => {
    it('should throw BadRequestException if role does not exist', async () => {
      jest.spyOn(roleRepository, 'findRoleById').mockResolvedValue(null);

      await expect(
        service.getPermissionOfRole('non-existing-id'),
      ).rejects.toThrow(
        new BadRequestException(
          'Role Not Found',
          AuthErrorCode.ROLE_FIND_FAILED,
        ),
      );

      expect(roleRepository.findRoleById).toHaveBeenCalledWith(
        'non-existing-id',
      );
    });

    it('should return the permissions of the role if role exists', async () => {
      jest.spyOn(roleRepository, 'findRoleById').mockResolvedValue(mockRole);

      const result = await service.getPermissionOfRole(mockRole.id);

      expect(roleRepository.findRoleById).toHaveBeenCalledWith(mockRole.id);
      expect(result).toEqual(mockRole.permissions);
    });
  });

  describe('createRole', () => {
    it('should create a new role successfully', async () => {
      const createRoleDto: CreateRoleDTO = mockRole;

      roleRepository.createRole.mockResolvedValue(mockRole);

      const result = await service.createRole(createRoleDto);

      expect(roleRepository.createRole).toHaveBeenCalledWith(createRoleDto);

      expect(result).toEqual(mockRole);
    });
  });

  describe('updateRole', () => {
    it('should update an existing role', async () => {
      const updateRoleDto: UpdateRoleDTO = mockRole;
      const listPermission: Permission[] = [];

      jest
        .spyOn(roleRepository, 'findRoleById')
        .mockReturnValue(mockRoles as any);

      jest
        .spyOn(userService, 'findUsersWithRoleId')
        .mockReturnValue(mockListUser as any);

      jest
        .spyOn(permissionRepository, 'findPermissionsWithIds')
        .mockReturnValue(listPermission as any);

      const result = await service.updateRole(mockRole.id, updateRoleDto);

      expect(roleRepository.findRoleById).toHaveBeenCalledWith(mockRole.id);

      expect(result.title).toEqual(mockRole.title);
    });

    it('should throw NotFoundException if role does not exist', async () => {
      jest
        .spyOn(roleRepository, 'findRoleById')
        .mockRejectedValue(new Error('Role not found'));

      await expect(
        service.updateRole('non-existing-id', mockRole),
      ).rejects.toThrow(
        new NotFoundException('Role not found', AuthErrorCode.ROLE_FIND_FAILED),
      );
    });
  });

  describe('updateStatusRole', () => {
    it('should throw NotFoundException if role does not exist', async () => {
      jest.spyOn(roleRepository, 'findRoleById').mockResolvedValue(null);

      await expect(
        service.updateStatusRole('non-existing-id', { status: true }),
      ).rejects.toThrow(
        new NotFoundException('Role not found', AuthErrorCode.ROLE_FIND_FAILED),
      );

      expect(roleRepository.findRoleById).toHaveBeenCalledWith(
        'non-existing-id',
      );
      expect(roleRepository.findRoleById).toHaveBeenCalledTimes(1);
    });

    it('should throw BadRequestException if trying to deactivate super admin', async () => {
      const mockSuperAdminRole = { ...mockRole, id: 'super-admin-id' };
      jest
        .spyOn(roleRepository, 'findRoleById')
        .mockRejectedValue(new Error("Super Admin Can't Deactivate"));

      await expect(
        service.updateStatusRole(mockSuperAdminRole.id, { status: true }),
      ).rejects.toThrow(
        new BadRequestException(
          "Super Admin Can't Deactivate",
          AuthErrorCode.ROLE_UPDATE_FAILED,
        ),
      );
    });

    it('should successfully update the role status', async () => {
      const updatedRole = { ...mockRole, status: true };
      jest.spyOn(roleRepository, 'findRoleById').mockResolvedValue(mockRole);
      jest
        .spyOn(roleRepository, 'updateStatusRole')
        .mockResolvedValue(updatedRole);
      jest
        .spyOn(userService, 'findUsersWithRoleId')
        .mockResolvedValue(mockListUser);

      const result = await service.updateStatusRole(mockRole.id, {
        status: true,
      });

      expect(roleRepository.findRoleById).toHaveBeenCalledWith(mockRole.id);
      expect(roleRepository.updateStatusRole).toHaveBeenCalledWith(
        mockRole.id,
        true,
      );
      expect(result).toEqual(updatedRole);
    });

    it('should clear cache for users with this role', async () => {
      jest.spyOn(roleRepository, 'findRoleById').mockResolvedValue(mockRole);
      jest
        .spyOn(roleRepository, 'updateStatusRole')
        .mockResolvedValue(mockRole);
      jest
        .spyOn(userService, 'findUsersWithRoleId')
        .mockResolvedValue(mockListUser);
      jest.spyOn(cacheService, 'deleteValue').mockResolvedValue(null);

      await service.updateStatusRole(mockRole.id, { status: true });

      for (const user of mockListUser) {
        expect(cacheService.deleteValue).toHaveBeenCalledWith(user.id);
        expect(cacheService.deleteValue).toHaveBeenCalledWith(user.email);
      }
    });
  });

  describe('deleteRole', () => {
    it('should throw NotFoundException if role does not exist', async () => {
      jest.spyOn(roleRepository, 'findRoleById').mockResolvedValue(null);

      await expect(service.deleteRole('non-existing-id')).rejects.toThrow(
        new NotFoundException('Role not found', AuthErrorCode.ROLE_FIND_FAILED),
      );

      expect(roleRepository.findRoleById).toHaveBeenCalledWith(
        'non-existing-id',
      );
    });

    it('should successfully delete a role', async () => {
      jest.spyOn(roleRepository, 'findRoleById').mockResolvedValue(mockRole);
      jest.spyOn(roleRepository, 'deleteRole').mockResolvedValue(mockRole);
      jest
        .spyOn(userService, 'findUsersWithRoleId')
        .mockResolvedValue(mockListUser);

      const result = await service.deleteRole(mockRole.id);

      expect(roleRepository.findRoleById).toHaveBeenCalledWith(mockRole.id);
      expect(roleRepository.deleteRole).toHaveBeenCalledWith(mockRole);
      expect(result).toEqual(mockRole);
    });

    it('should clear cache for users with this role', async () => {
      jest.spyOn(roleRepository, 'findRoleById').mockResolvedValue(mockRole);
      jest.spyOn(roleRepository, 'deleteRole').mockResolvedValue(mockRole);
      jest
        .spyOn(userService, 'findUsersWithRoleId')
        .mockResolvedValue(mockListUser);
      jest.spyOn(cacheService, 'deleteValue').mockResolvedValue(null);

      await service.deleteRole(mockRole.id);

      for (const user of mockListUser) {
        expect(cacheService.deleteValue).toHaveBeenCalledWith(user.id);
        expect(cacheService.deleteValue).toHaveBeenCalledWith(user.email);
      }
    });
  });
});
