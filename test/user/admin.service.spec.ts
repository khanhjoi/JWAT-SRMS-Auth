import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from 'src/Token/token.service';
import { RoleRepository } from 'src/role/role.repository';
import { CacheSharedService } from '@khanhjoi/protos';
import {
  NotFoundException,
  BadRequestException,
} from '@khanhjoi/protos/dist/errors/http';
import { AuthErrorCode } from '@khanhjoi/protos/dist/errors/AuthError.enum';
import { OffsetPaginationDto } from 'src/common/dto/offsetPagination.dto';
import { IOffsetPaginatedType } from 'src/common/interface/offsetPagination.interface';
import {
  mockUpdateUser,
  mockUsersPaginated,
  userRepositoryMock,
} from './mocks';
import { userServiceMock } from './mocks/user.mockService.mock';
import { AdminUserService } from '@user/admin.service';
import { UserRepository } from '@user/user.repository';
import { UserService } from '@user/user.service';
import { mockToken, mockTokenService } from 'test/token/mocks';

describe('AdminUserService', () => {
  let adminUserService: AdminUserService;
  let userRepository: UserRepository;
  let userService: UserService;
  let tokenService: TokenService;
  let roleRepository: jest.Mocked<RoleRepository>;
  let cacheService: jest.Mocked<CacheSharedService>;

  const mockRoleRepository = {
    findRoleById: jest.fn().mockResolvedValue({ id: 'role-id' }),
  };

  const mockCacheService = {
    deleteValue: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminUserService,
        { provide: UserRepository, useValue: userRepositoryMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: TokenService, useValue: mockTokenService },
        { provide: RoleRepository, useValue: mockRoleRepository },
        { provide: 'CACHE_SERVICE', useValue: mockCacheService },
      ],
    }).compile();

    adminUserService = module.get<AdminUserService>(AdminUserService);
    userRepository = module.get<UserRepository>(UserRepository);
    userService = module.get<UserService>(UserService);
    tokenService = module.get<TokenService>(TokenService);
    roleRepository = module.get(RoleRepository);
    cacheService = module.get('CACHE_SERVICE');
  });

  describe('findAllUserWithPagination', () => {
    it('should return paginated users', async () => {
      const paginationDto: OffsetPaginationDto = { limit: 6, page: 1 };
      jest.spyOn(adminUserService, 'findAllUserWithPagination');

      const result =
        await adminUserService.findAllUserWithPagination(paginationDto);

      expect(userRepository.findAllUserWithPagination).toHaveBeenCalledWith(
        paginationDto,
        [
          'id',
          'lastName',
          'firstName',
          'email',
          'createdAt',
          'role',
          'isDelete',
        ],
        ['role'],
      );

      expect(adminUserService.findAllUserWithPagination).toHaveBeenCalledTimes(
        1,
      );
      expect(adminUserService.findAllUserWithPagination).toHaveBeenCalledWith(
        paginationDto,
      );
      expect(result).toEqual(mockUsersPaginated);
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const mockUpdateInput = mockUpdateUser;
      jest.spyOn(adminUserService, 'updateUser');

      const result = await adminUserService.updateUser(mockUpdateUser);

      expect(adminUserService.updateUser).toHaveBeenCalledTimes(1);
      expect(adminUserService.updateUser).toHaveBeenCalledWith(mockUpdateUser);
      expect(result).toEqual(mockUpdateInput);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      await expect(
        adminUserService.updateUser({ ...mockUpdateUser, id: '' }),
      ).rejects.toThrow(
        new NotFoundException('User Not Found', AuthErrorCode.USER_NOT_FOUND),
      );
    });

    it('should throw BadRequestException if email is already taken', async () => {
      await expect(
        adminUserService.updateUser({
          ...mockUpdateUser,
          email: 'test@gmail.com',
        }),
      ).rejects.toThrow(
        new BadRequestException(
          'This email is already taken',
          AuthErrorCode.USER_NOT_FOUND,
        ),
      );
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      tokenService.findTokenOfUserId = jest.fn().mockResolvedValue(mockToken);

      const result = await adminUserService.deleteUser(mockToken.user.id);

      expect(userRepository.findUserById).toHaveBeenCalledWith(
        mockToken.user.id,
      );

      expect(tokenService.findTokenOfUserId).toHaveBeenCalledWith(
        mockToken.user.id,
        expect.any(String),
      );
      expect(cacheService.deleteValue).toHaveBeenCalledWith(
        mockToken.user.email,
      );
      expect(result).toEqual({ ...mockToken.user, isDelete: true });
    });

    it('should throw NotFoundException if user does not exist', async () => {
      await expect(adminUserService.deleteUser('')).rejects.toThrow(
        new NotFoundException('User not found!', AuthErrorCode.USER_NOT_FOUND),
      );
    });
  });

  describe('activeUser', () => {
    it('should activate user successfully', async () => {
      const result = await adminUserService.activeUser(mockToken.user.id);

      expect(userRepository.findUserById).toHaveBeenCalledWith(
        mockToken.user.id,
      );
      expect(cacheService.deleteValue).toHaveBeenCalledWith(
        mockToken.user.email,
      );
      expect(result).toEqual({ ...mockToken.user, isDelete: false });
    });

    it('should throw NotFoundException if user does not exist', async () => {
      userRepository.findUserById = jest.fn().mockResolvedValue(null);
      await expect(adminUserService.activeUser('')).rejects.toThrow(
        new NotFoundException('User not found!', AuthErrorCode.USER_NOT_FOUND),
      );
    });
  });

  describe('assignRole', () => {
    it('should assign role successfully', async () => {
      const result = await adminUserService.assignRole(
        mockToken.user.id,
        'role-id',
      );

      expect(userService.findUserById).toHaveBeenCalledWith(mockToken.user.id);
      expect(roleRepository.findRoleById).toHaveBeenCalledWith('role-id');
      expect(cacheService.deleteValue).toHaveBeenCalledWith(
        mockToken.user.email,
      );
      expect(result).toEqual({ ...mockToken.user, role: { id: 'role-id' } });
    });

    it('should throw NotFoundException if user does not exist', async () => {
      const userId = '123';

      await expect(
        adminUserService.assignRole(userId, 'role-id'),
      ).rejects.toThrow(
        new NotFoundException(
          `User ${userId} does not exist`,
          AuthErrorCode.USER_NOT_FOUND,
        ),
      );
    });
  });
});
