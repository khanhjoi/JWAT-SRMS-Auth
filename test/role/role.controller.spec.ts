import { RoleController } from '@/role/role.controller';
import { RoleService } from '@/role/role.service';
import { Test, TestingModule } from '@nestjs/testing';

import { OffsetPaginationDto } from 'src/common/dto/offsetPagination.dto';
import { mockRole, mockRoles } from './mocks/role.data.mock';
import { IOffsetPaginatedType } from '@common/interface/offsetPagination.interface';
import { Role } from '@/role/entity/role.entity';
import { CreateRoleDTO } from '@/role/dto/request/create-role.dto';
import { UpdateRoleDTO } from '@/role/dto/request/update-role.dto';
import { UpdateStatusRole } from '@/role/dto/request/update-status-role.dto';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AbilitiesGuard } from '@khanhjoi/protos';
import { Reflector } from '@nestjs/core';
import { UserService } from '@user/user.service';

describe('RoleController', () => {
  let roleController: RoleController;
  let roleService: RoleService;

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
      controllers: [RoleController],
      providers: [
        RoleService,
        {
          provide: RoleService,
          useValue: {
            getRolesWithPagination: jest.fn(),
            getRoles: jest.fn(),
            getRoleWithId: jest.fn(),
            createRole: jest.fn(),
            updateRole: jest.fn(),
            updateStatusRole: jest.fn(),
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
          provide: UserService,
          useValue: {
            findUserById: jest.fn(),
          },
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

    roleController = module.get<RoleController>(RoleController);
    roleService = module.get<RoleService>(RoleService);
  });

  it('should be defined', () => {
    expect(roleController).toBeDefined();
  });

  describe('getRolesWithPagination', () => {
    it('should return paginated roles', async () => {
      const paginationDto: OffsetPaginationDto = { limit: 6, page: 1 };
      const result: IOffsetPaginatedType<Role> = {
        data: mockRoles,
        totalCount: mockRoles.length,
      };

      jest
        .spyOn(roleService, 'getRolesWithPagination')
        .mockResolvedValue(result);

      expect(await roleController.getRolesWithPagination(paginationDto)).toBe(
        result,
      );
      expect(roleService.getRolesWithPagination).toHaveBeenCalledWith(
        paginationDto,
      );
    });
  });

  describe('getAllRoles', () => {
    it('should return all roles', async () => {
      const result: Role[] = mockRoles;

      jest.spyOn(roleService, 'getRoles').mockResolvedValue(result);

      expect(await roleController.getAllRoles()).toBe(result);
      expect(roleService.getRoles).toHaveBeenCalled();
    });
  });

  describe('getRoles', () => {
    it('should return a role by id', async () => {
      const roleId = 'test-id';
      const result: Role = new Role();

      jest.spyOn(roleService, 'getRoleWithId').mockResolvedValue(result);

      expect(await roleController.getRoles(roleId)).toBe(result);
      expect(roleService.getRoleWithId).toHaveBeenCalledWith(roleId);
    });
  });

  describe('createRole', () => {
    it('should create a role', async () => {
      const createRoleDto: CreateRoleDTO = mockRole;
      const result: Role = new Role();

      jest.spyOn(roleService, 'createRole').mockResolvedValue(result);

      expect(await roleController.createRole(createRoleDto)).toBe(result);
      expect(roleService.createRole).toHaveBeenCalledWith(createRoleDto);
    });
  });

  describe('updateRole', () => {
    it('should update a role', async () => {
      const updateRoleDto: UpdateRoleDTO = mockRole;
      const roleId = 'test-id';
      const result: Role = new Role();

      jest.spyOn(roleService, 'updateRole').mockResolvedValue(result);

      expect(await roleController.updateRole(updateRoleDto, roleId)).toBe(
        result,
      );
      expect(roleService.updateRole).toHaveBeenCalledWith(
        roleId,
        updateRoleDto,
      );
    });
  });

  describe('activeRole', () => {
    it('should update the status of a role', async () => {
      const updateStatusRoleDto: UpdateStatusRole = { status: false };
      const roleId = 'test-id';
      const result: Role = new Role();

      jest.spyOn(roleService, 'updateStatusRole').mockResolvedValue(result);

      expect(await roleController.activeRole(roleId, updateStatusRoleDto)).toBe(
        result,
      );
      expect(roleService.updateStatusRole).toHaveBeenCalledWith(
        roleId,
        updateStatusRoleDto,
      );
    });
  });

  describe('deleteRole', () => {
    it('should delete a role', async () => {
      const roleId = 'test-id';
      const result: Role = new Role();

      jest.spyOn(roleService, 'deleteRole').mockResolvedValue(result);

      expect(await roleController.deleteRole(roleId)).toBe(result);
      expect(roleService.deleteRole).toHaveBeenCalledWith(roleId);
    });
  });
});
