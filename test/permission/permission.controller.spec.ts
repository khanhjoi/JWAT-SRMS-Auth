import { PermissionController } from '@/permission/permission.controller';
import { PermissionService } from '@/permission/permission.service';
import { Test, TestingModule } from '@nestjs/testing';
import { Permission } from '@/permission/entity/permission.entity';
import { CreatePermissionDTO } from '@/permission/dto/create-permission.dto';
import { UpdatePermissionDTO } from '@/permission/dto/update-permission.dto';
import { OffsetPaginationDto } from 'src/common/dto/offsetPagination.dto';
import { IOffsetPaginatedType } from 'src/common/interface/offsetPagination.interface';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AbilitiesGuard } from 'src/auth/guard/abilities.guard';
import { Reflector } from '@nestjs/core';
import { mockPermission, mockPermissions } from './mocks';
import { RoleService } from '@/role/role.service';
import { UserService } from '@user/user.service';
import { RoleController } from '@/role/role.controller';
import { userServiceMock } from 'test/role/mocks/role.mockService.mock';

describe('PermissionController', () => {
  let permissionController: PermissionController;
  let permissionService: PermissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (config: ConfigService) => {
            return {
              global: true,
              secret: config.get<string>('jwt_secret'),
              signOptions: {
                expiresIn: config.get<string>('jwt_expires'),
              },
            };
          },
          inject: [ConfigService],
        }),
        ConfigModule,
      ],
      controllers: [PermissionController],
      providers: [
        {
          provide: UserService,
          useValue: userServiceMock,
        },
        {
          provide: PermissionService,
          useValue: {
            getRolesWithPagination: jest.fn(),
            getPermissionsWithPagination: jest.fn(),
            getPermissions: jest.fn(),
            getRoles: jest.fn(),
            getRoleWithId: jest.fn(),
            createRole: jest.fn(),
            updateRole: jest.fn(),
            createPermission: jest.fn(),
            deletePermission: jest.fn(),
            updateStatusRole: jest.fn(),
            updatePermission: jest.fn(),
            deleteRole: jest.fn(),
          },
        },
        {
          provide: AbilitiesGuard,
          useValue: {
            canActivate: jest.fn(() => true),
          },
        },
        {
          provide: Reflector,
          useValue: {},
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

    permissionController =
      module.get<PermissionController>(PermissionController);
    permissionService = module.get<PermissionService>(PermissionService);
  });

  it('should be defined', () => {
    expect(permissionController).toBeDefined();
  });

  describe('getPermissionsWithPagination', () => {
    it('should return paginated permissions', async () => {
      const paginationDto: OffsetPaginationDto = { limit: 6, page: 1 };
      const result: IOffsetPaginatedType<Permission> = {
        data: mockPermissions,
        totalCount: mockPermissions.length,
      };

      jest
        .spyOn(permissionService, 'getPermissionsWithPagination')
        .mockResolvedValue(result);

      expect(
        await permissionController.getPermissionsWithPagination(paginationDto),
      ).toBe(result);
      expect(
        permissionService.getPermissionsWithPagination,
      ).toHaveBeenCalledWith(paginationDto);
    });
  });

  describe('getPermission', () => {
    it('should return all permissions', async () => {
      const result: Permission[] = mockPermissions;

      jest.spyOn(permissionService, 'getPermissions').mockResolvedValue(result);

      expect(await permissionController.getPermission()).toBe(result);
      expect(permissionService.getPermissions).toHaveBeenCalled();
    });
  });

  describe('createRole', () => {
    it('should create a permission', async () => {
      const createPermissionDto: CreatePermissionDTO = mockPermission;
      const result: Permission = new Permission(); // Replace with actual Permission object if needed

      jest
        .spyOn(permissionService, 'createPermission')
        .mockResolvedValue(result);

      expect(await permissionController.createRole(createPermissionDto)).toBe(
        result,
      );
      expect(permissionService.createPermission).toHaveBeenCalledWith(
        createPermissionDto,
      );
    });
  });

  describe('updateRole', () => {
    it('should update a permission', async () => {
      const updatePermissionDto: UpdatePermissionDTO = mockPermission; // Adjust based on your mock data
      const permissionId = 'test-id';
      const result: Permission = new Permission(); // Replace with actual Permission object if needed

      jest
        .spyOn(permissionService, 'updatePermission')
        .mockResolvedValue(result);

      expect(
        await permissionController.updateRole(
          permissionId,
          updatePermissionDto,
        ),
      ).toBe(result);
      expect(permissionService.updatePermission).toHaveBeenCalledWith(
        permissionId,
        updatePermissionDto,
      );
    });
  });

  describe('deleteRole', () => {
    it('should delete a permission', async () => {
      const permissionId = 'test-id';
      const result: Permission = new Permission(); // Replace with actual Permission object if needed

      jest
        .spyOn(permissionService, 'deletePermission')
        .mockResolvedValue(result);

      expect(await permissionController.deleteRole(permissionId)).toBe(result);
      expect(permissionService.deletePermission).toHaveBeenCalledWith(
        permissionId,
      );
    });
  });
});
