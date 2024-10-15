import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from 'src/user/user.repository';
import { UserService } from 'src/user/user.service';
import { CacheSharedService } from '@khanhjoi/protos';
import { CreateUserDTO } from '@/user/dto/create-user.dto';
import {
  mockCreatedUser,
  mockListUser,
  mockUpdateUser,
  mockUserExitData,
  userRepositoryMock,
} from './mocks';
import {
  BadRequestException,
  NotFoundException,
} from '@khanhjoi/protos/dist/errors/http';
import { AuthErrorCode } from '@khanhjoi/protos/dist/errors/AuthError.enum';

describe('UserService', () => {
  let service: UserService;
  let userRepository: jest.Mocked<UserRepository>;
  let cacheService: jest.Mocked<CacheSharedService>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useValue: userRepositoryMock },
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

    service = module.get<UserService>(UserService);
    userRepository = module.get(UserRepository);
    cacheService = module.get('CACHE_SERVICE');
  });

  afterEach(() => {
    jest.clearAllMocks(); // Ensure a clean slate between tests
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const input: CreateUserDTO = { ...mockCreatedUser };
      userRepository.findUserByEmail.mockResolvedValue(null);
      userRepository.createNewUser.mockResolvedValue(mockCreatedUser);

      const result = await service.createUser(input);

      result.password = '';

      expect(result).toEqual(mockCreatedUser);
    });

    it('should throw an error if user already exists', async () => {
      userRepository.findUserByEmail.mockResolvedValue(mockCreatedUser);

      await expect(service.createUser(mockCreatedUser)).rejects.toThrow(
        'User already exists',
      );
      expect(userRepository.findUserByEmail).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if user already exists', async () => {
      userRepository.findUserByEmail.mockResolvedValue({
        ...mockCreatedUser,
        isDelete: true,
      });

      await expect(service.createUser(mockCreatedUser)).rejects.toThrow(
        'User was deactivated. Please contact admin for further detail',
      );
      expect(userRepository.findUserByEmail).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateUser', () => {
    it('should update a user successfully', async () => {
      userRepository.findUserById.mockResolvedValue(mockUserExitData);
      userRepository.updateUser.mockResolvedValue(mockUpdateUser);

      const result = await service.updateUser(mockUpdateUser);
      result.password = '';

      expect(result).toEqual(mockUpdateUser);
      expect(userRepository.findUserById).toHaveBeenCalledWith(
        mockUpdateUser.id,
      );
      expect(userRepository.updateUser).toHaveBeenCalledWith(mockUpdateUser);
    });

    it('should throw an error if user is not found', async () => {
      userRepository.findUserById.mockResolvedValue(null);

      await expect(service.updateUser(mockUpdateUser)).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('updateProfileUser', () => {
    it('should update the user profile successfully', async () => {
      const mockUserId = '1132e528-c197-48a9-828d-004f1c52b028';
      const mockUpdateInput = { ...mockUpdateUser };

      userRepository.findUserById.mockResolvedValue(mockUpdateUser);
      userRepository.findUserByEmail.mockResolvedValue(null);
      userRepository.updateUser.mockResolvedValue(mockUpdateInput);

      const result = await service.updateProfileUser(
        mockUserId,
        mockUpdateInput,
      );

      result.password = '';

      expect(result).toEqual(mockUpdateInput);
    });

    it('should throw an error if user not exit', async () => {
      userRepository.findUserById.mockResolvedValue(null);

      await expect(
        service.updateProfileUser('id', { ...mockCreatedUser }),
      ).rejects.toThrow(
        new NotFoundException('User not found', AuthErrorCode.USER_NOT_FOUND),
      );
    });
    it('should throw an error if email is already taken', async () => {
      userRepository.findUserById.mockResolvedValue(mockCreatedUser);
      userRepository.findUserByEmail.mockResolvedValue({
        ...mockCreatedUser,
        email: 'orther@gmail.com',
      });

      await expect(
        service.updateProfileUser(mockCreatedUser.id, { ...mockCreatedUser }),
      ).rejects.toThrow(
        new BadRequestException(
          'Email has already been taken',
          AuthErrorCode.USER_UPDATE_FAILED,
        ),
      );
    });
  });

  describe('findUserById', () => {
    it('should return user if found', async () => {
      const mockId = '1132e528-c197-48a9-828d-004f1c52b028';
      cacheService.getValueByKey.mockResolvedValue(null);
      userRepository.findUserById.mockResolvedValue(mockUpdateUser);

      const result = await service.findUserById(mockId);

      expect(result).toEqual(mockUpdateUser);
      expect(userRepository.findUserById).toHaveBeenCalledWith(
        mockId,
        undefined,
      );
    });

    it('should return data cached', async () => {
      const mockId = '1132e528-c197-48a9-828d-004f1c52b028';
      cacheService.getValueByKey.mockResolvedValue(mockUpdateUser);
      userRepository.findUserById.mockResolvedValue(mockUpdateUser);

      const result = await service.findUserById(mockId);

      expect(result).toEqual(mockUpdateUser);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      const invalidEmail = 'nonexistent@example.com';

      // Simulate the repository returning null for a non-existing user
      userRepository.findUserByEmail.mockResolvedValueOnce(null);

      await expect(service.findUserByEmail(invalidEmail)).rejects.toThrow(
        new NotFoundException('User not found', AuthErrorCode.USER_NOT_FOUND),
      );
    });
  });

  describe('findUserByEmail', () => {
    it('should return user if found', async () => {
      const mockEmail = 'userMaster@gmail.com';
      cacheService.getValueByKey.mockResolvedValue(null);
      userRepository.findUserByEmail.mockResolvedValue(mockUserExitData);

      const result = await service.findUserByEmail(mockEmail);

      expect(result).toEqual(mockUserExitData);
      expect(userRepository.findUserByEmail).toHaveBeenCalledWith(
        mockEmail,
        undefined,
        undefined,
      );
    });

    it('should return data cached', async () => {
      const mockId = '1132e528-c197-48a9-828d-004f1c52b028';
      cacheService.getValueByKey.mockResolvedValue(mockUpdateUser);
      userRepository.findUserByEmail.mockResolvedValue(mockUpdateUser);

      const result = await service.findUserById(mockId);

      expect(result).toEqual(mockUpdateUser);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      const invalidUserEmail = 'invalid-email@gmail.com';
      userRepository.findUserByEmail.mockResolvedValue(null);

      await expect(service.findUserByEmail(invalidUserEmail)).rejects.toThrow(
        new NotFoundException('User not found', AuthErrorCode.USER_NOT_FOUND),
      );
    });
  });

  describe('findUsersWithRoleId', () => {
    it('should return users with the specified role ID', async () => {
      const mockRoleId = '93d13875-ae1d-4283-a877-ab1eac71e066';
      const expectedUsers = mockListUser.filter(
        (user) => user.role?.id === mockRoleId,
      );

      userRepository.findUsersWithRoleId.mockResolvedValue(expectedUsers);

      const result = await service.findUsersWithRoleId(mockRoleId);

      expect(result).toEqual(expectedUsers);
    });
  });
});
