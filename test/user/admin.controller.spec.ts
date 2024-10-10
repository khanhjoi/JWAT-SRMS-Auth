import { Test, TestingModule } from '@nestjs/testing';
import { userServiceMock } from './mocks/user.mockService.mock';

import { Action } from 'src/common/enums/action.enum';
import { AssignRoleDto } from 'src/role/dto/request/assign-permission.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { AbilitiesGuard } from 'src/auth/guard/abilities.guard';
import { AdminController } from '@user/admin.controller';
import { AdminUserService } from '@user/admin.service';
import { UserService } from '@user/user.service';
import { adminUserServiceMock } from './mocks/admin.mockService.mock';
import { mockListUser, mockUserExitData } from './mocks';
import { OffsetPaginationDto } from '@common/dto/offsetPagination.dto';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheSharedService } from '@khanhjoi/protos';
import { CreateUserDTO } from '@user/dto/create-user.dto';
import { UpdateUserByAdminDTO } from '@user/dto/update-user-by-admin.dto';

describe('AdminController', () => {
  let controller: AdminController;
  let adminUserService: AdminUserService;
  let userService: UserService;
  let cacheService: jest.Mocked<CacheSharedService>;

  const mockCacheService = {
    deleteValue: jest.fn(),
  };

  beforeAll(async () => {
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
      controllers: [AdminController],
      providers: [
        {
          provide: AdminUserService,
          useValue: adminUserServiceMock, // Mocked admin user service
        },
        {
          provide: UserService,
          useValue: userServiceMock, // Mocked user service
        },
        { provide: 'CACHE_SERVICE', useValue: mockCacheService },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
    adminUserService = module.get<AdminUserService>(AdminUserService);
    userService = module.get<UserService>(UserService);
  });

  describe('getUsersAdmin', () => {
    it('should return a paginated list of users', async () => {
      const paginationDto: OffsetPaginationDto = { limit: 6, page: 1 };
      const mockUsers = mockListUser; // Create mock users

      jest
        .spyOn(adminUserService, 'findAllUserWithPagination')
        .mockResolvedValue({
          data: mockUsers,
          totalCount: mockUsers.length,
        });

      const result = await controller.getUsersAdmin(paginationDto as any);

      expect(adminUserService.findAllUserWithPagination).toHaveBeenCalledWith(
        paginationDto,
      );
      expect(result).toEqual({
        data: mockUsers,
        totalCount: mockUsers.length,
      });
    });
  });

  describe('getUserDetailAdmin', () => {
    it('should return user details', async () => {
      const mockUserId = mockUserExitData.id;

      jest
        .spyOn(userService, 'findUserById')
        .mockResolvedValue(mockUserExitData);

      const result = await controller.getUserDetailAdmin(mockUserId);

      expect(userService.findUserById).toHaveBeenCalledWith(mockUserId, [
        'id',
        'lastName',
        'firstName',
        'email',
        'createdAt',
        'role',
      ]);
      expect(result).toEqual(mockUserExitData);
    });
  });

  describe('addUserAdmin', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDTO = mockUserExitData;

      jest.spyOn(userService, 'createUser').mockResolvedValue(mockUserExitData);

      const result = await controller.addUserAdmin(createUserDto);

      expect(userService.createUser).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(mockUserExitData);
    });
  });

  describe('assignRole', () => {
    it('should assign a role to a user', async () => {
      const assignRoleDto: AssignRoleDto = {
        userId: mockUserExitData.id,
        roleId: mockUserExitData.role.id,
      };

      jest
        .spyOn(adminUserService, 'assignRole')
        .mockResolvedValue(mockUserExitData);

      const result = await controller.assignRole(assignRoleDto);

      expect(adminUserService.assignRole).toHaveBeenCalledWith(
        assignRoleDto.userId,
        assignRoleDto.roleId,
      );
      expect(result).toEqual(mockUserExitData);
    });
  });

  describe('updateUser', () => {
    it('should update user details', async () => {
      const updateUserDto: UpdateUserByAdminDTO = mockUserExitData;

      jest
        .spyOn(adminUserService, 'updateUser')
        .mockResolvedValue(mockUserExitData);

      const result = await controller.updateUser(updateUserDto);

      expect(adminUserService.updateUser).toHaveBeenCalledWith(updateUserDto);
      expect(result).toEqual(mockUserExitData);
    });
  });

  describe('activeUser', () => {
    it('should activate a user', async () => {
      const mockUserId = mockUserExitData.id;

      jest
        .spyOn(adminUserService, 'activeUser')
        .mockResolvedValue(mockUserExitData);

      const result = await controller.activeUser(mockUserId);

      expect(adminUserService.activeUser).toHaveBeenCalledWith(mockUserId);
      expect(result).toEqual(mockUserExitData);
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const mockUserId = mockUserExitData.id;

      jest
        .spyOn(adminUserService, 'deleteUser')
        .mockResolvedValue(mockUserExitData);

      const result = await controller.delete(mockUserId);

      expect(adminUserService.deleteUser).toHaveBeenCalledWith(mockUserId);
      expect(result).toEqual(mockUserExitData);
    });
  });
});
