import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from 'src/user/user.repository';
import { UserService } from 'src/user/user.service';
import { CacheSharedService } from '@khanhjoi/protos';
import {
  MockUser,
  mockCreatedUser,
  mockListUser,
  mockUpdateUser,
  mockUserExitData,
  userRepositoryMock,
} from './mocks';
import { CreateUserDTO } from '@/user/dto/create-user.dto';
import { User } from '@user/entity/user.entity';
import { userServiceMock } from './mocks/user.mockService.mock';

describe('UserService', () => {
  let service: UserService;
  let userRepository: jest.Mocked<UserRepository>;
  let cacheService: jest.Mocked<CacheSharedService>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: userRepositoryMock, // Mock UserRepository
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

    service = module.get<UserService>(UserService);
    userRepository = module.get(UserRepository);
    cacheService = module.get('CACHE_SERVICE');
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const mockCreateInput: CreateUserDTO = {
        firstName: mockCreatedUser.firstName,
        lastName: mockCreatedUser.lastName,
        email: mockCreatedUser.email,
        password: mockCreatedUser.password,
      };
      const mockCreateResult = mockCreatedUser;

      userRepository.findUserByEmail.mockResolvedValue(null);
      userRepository.createNewUser.mockResolvedValue(mockCreatedUser);

      const result = await service.createUser(mockCreateInput);

      expect(result).toEqual(mockCreateResult);
      expect(userRepository.findUserByEmail).toHaveBeenCalledTimes(1);
      expect(userRepository.createNewUser).toHaveBeenCalledTimes(1);
      expect(userRepository.createNewUser).toHaveBeenCalledWith({
        email: mockCreateInput.email,
        password: expect.any(String),
        firstName: mockCreateInput.firstName,
        lastName: mockCreateInput.lastName,
      });
    });
  });

  describe('updateUser', () => {
    it('should update a user successfully', async () => {
      const mockUpdateInput = mockUpdateUser;
      const mockUpdatedResult = mockUpdateUser;

      userRepository.findUserById.mockResolvedValue(mockUserExitData);
      userRepository.updateUser.mockResolvedValue(mockUpdatedResult);

      const result = await service.updateUser(mockUpdateInput);

      expect(result).toEqual(mockUpdatedResult);
      expect(userRepository.findUserById).toBeCalledTimes(1);
      expect(userRepository.updateUser).toBeCalledTimes(1);
      expect(userRepository.updateUser).toBeCalledWith(mockUpdateInput);
    });
  });

  describe('updateProfileUser', () => {
    it('should update user profile successfully', async () => {
      const mockUserId = '1132e528-c197-48a9-828d-004f1c52b028';
      const mockUpdateInput = { ...mockUpdateUser, password: 'newPassword' };

      jest.spyOn(service, 'updateProfileUser');

      userRepository.findUserById.mockResolvedValue(mockUpdateInput); // Simulate finding the user
      userRepository.findUserByEmail.mockResolvedValue(null); // Simulate no email conflict
      userRepository.updateUser.mockResolvedValue(mockUpdateInput); // Simulate successful update

      const result = await service.updateProfileUser(
        mockUserId,
        mockUpdateInput,
      );

      expect(userRepository.findUserById).toHaveBeenCalledTimes(1);
      expect(userRepository.updateUser).toHaveBeenCalledTimes(1);
      expect(service.updateProfileUser).toHaveBeenCalledTimes(1);
      expect(service.updateProfileUser).toHaveBeenCalledWith(
        mockUserId,
        mockUpdateInput,
      );
      expect(result).toEqual(mockUpdateInput);
    });
  });

  describe('findUserById', () => {
    it('should find a user by ID', async () => {
      const mockId = '1132e528-c197-48a9-828d-004f1c52b028';
      const mockUser: User = { ...mockUpdateUser, id: mockId };

      jest.spyOn(service, 'findUserById');

      cacheService.getValueByKey.mockResolvedValue(null); // Simulate no cache
      userRepository.findUserById.mockResolvedValue(mockUser); // Simulate finding the user

      const result = await service.findUserById(mockId);

      expect(userRepository.findUserById).toHaveBeenCalledTimes(1);
      expect(userRepository.findUserById).toHaveBeenCalledWith(
        mockId,
        undefined,
      );

      expect(service.findUserById).toHaveBeenCalledTimes(1);
      expect(service.findUserById).toHaveBeenCalledWith(mockId);
      expect(result.id).toEqual(mockId);
    });
  });

  describe('findUserByEmail', () => {
    it('should find a user by email', async () => {
      const mockEmail = 'userMaster@gmail.com';
      const mockUser: User = { ...mockUserExitData, email: mockEmail };

      jest.spyOn(service, 'findUserByEmail');

      cacheService.getValueByKey.mockResolvedValue(null); // Simulate no cache
      userRepository.findUserByEmail.mockResolvedValue(mockUser); // Simulate finding the user

      const result = await service.findUserByEmail(mockEmail);

      expect(userRepository.findUserByEmail).toHaveBeenCalledTimes(1);
      expect(userRepository.findUserByEmail).toHaveBeenCalledWith(
        mockEmail,
        undefined,
        undefined,
      );

      expect(service.findUserByEmail).toHaveBeenCalledTimes(1);
      expect(service.findUserByEmail).toHaveBeenCalledWith(mockEmail);
      expect(result.email).toEqual(mockEmail);
    });
  });

  describe('findUsersWithRoleId', () => {
    it('should find users with a specific role ID', async () => {
      const mockRoleId = '93d13875-ae1d-4283-a877-ab1eac71e066';
      const usersWithRoleId = mockListUser.filter(
        (user) => user.role?.id === mockRoleId,
      );

      jest.spyOn(service, 'findUsersWithRoleId');

      userRepository.findUsersWithRoleId.mockResolvedValue(usersWithRoleId); // Simulate finding users

      const result = await service.findUsersWithRoleId(mockRoleId);

      expect(userRepository.findUsersWithRoleId).toHaveBeenCalledTimes(1);
      expect(userRepository.findUsersWithRoleId).toHaveBeenCalledWith(
        mockRoleId,
      );

      expect(service.findUsersWithRoleId).toHaveBeenCalledTimes(1);
      expect(service.findUsersWithRoleId).toHaveBeenCalledWith(mockRoleId);
      expect(result).toEqual(usersWithRoleId);
    });
  });
});
