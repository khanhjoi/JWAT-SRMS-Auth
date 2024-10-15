import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from 'src/user/user.repository';
import {
  mockCreatedUser,
  mockListUser,
  mockUpdateUser,
  mockUserExitData,
  userInjectRepoMock,
} from './mocks';
import { CreateUserDTO } from '@/user/dto/create-user.dto';
import { User } from '@user/entity/user.entity';
import { OffsetPaginationDto } from '@common/dto/offsetPagination.dto';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@khanhjoi/protos/dist/errors/http';
import { AuthErrorCode } from '@khanhjoi/protos/dist/errors/AuthError.enum';
import { SortOrder } from '@common/enums/order.enum';

describe('UserRepository', () => {
  let repository: UserRepository;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getRepositoryToken(User),
          useValue: userInjectRepoMock, // Mocked repository
        },
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  beforeEach(() => {
    jest.clearAllMocks(); // Clear all mocks before each test
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('Create User', () => {
    it('should create a User', async () => {
      const mockCreateInput: CreateUserDTO = mockUserExitData;
      const mockCreateResult: User = {
        ...mockUserExitData,
        id: 'mockedUserId',
      }; // Mocked created user with an id

      // Mock the save method of userRepository
      jest.spyOn(userRepository, 'save').mockResolvedValue(mockCreateResult);

      const result = await repository.createNewUser(mockCreateInput);

      // Verify the repository's save method was called
      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledWith(mockCreateInput);
      expect(result).toEqual(mockCreateResult);
    });

    it('should throw an error if user creation fails', async () => {
      const mockCreateInput: CreateUserDTO = mockUserExitData;

      // Mocking the save method to throw an error
      jest
        .spyOn(userRepository, 'save')
        .mockRejectedValue(new Error('Database error'));

      await expect(repository.createNewUser(mockCreateInput)).rejects.toThrow(
        new BadRequestException(
          'Create user failed',
          AuthErrorCode.DATABASE_ERROR,
        ),
      );

      // Ensure the save method was called
      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledWith(mockCreateInput);
    });
  });

  describe('Update User', () => {
    it('should update a User', async () => {
      const mockUpdateInput: User = { ...mockUpdateUser, id: 'mockedUserId' }; // Include the id for the user to be updated
      const mockUpdatedResult: User = { ...mockUpdateUser, id: 'mockedUserId' }; // Result after updating

      // Mock the save method of userRepository to return the updated user
      jest.spyOn(userRepository, 'save').mockResolvedValue(mockUpdatedResult);

      const result = await repository.updateUser(mockUpdateInput);

      // Check that the returned result matches the updated user
      expect(result).toEqual(mockUpdatedResult);
      // Verify that the save method was called
      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledWith(mockUpdateInput);
    });

    it('should handle error when updating user fails', async () => {
      const mockUpdateInput: User = { ...mockUpdateUser, id: 'mockedUserId' }; // Include the id for the user to be updated

      // Mock the save method to throw an error
      jest
        .spyOn(userRepository, 'save')
        .mockRejectedValue(new Error('Database error'));

      await expect(repository.updateUser(mockUpdateInput)).rejects.toThrow(
        new BadRequestException(
          'Update user failed',
          AuthErrorCode.DATABASE_ERROR,
        ),
      );

      // Ensure the save method was called
      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledWith(mockUpdateInput);
    });
  });

  describe('Find User By Id', () => {
    it('should find a User by Id with selected fields', async () => {
      const mockId = '1132e528-c197-48a9-828d-004f1c52b028';
      const mockUser = { ...mockCreatedUser, id: mockId };

      // Mocking userRepository and its methods
      const queryBuilderMock = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockUser),
      };

      jest
        .spyOn(userRepository, 'createQueryBuilder')
        .mockReturnValue(queryBuilderMock as any);

      const result = await repository.findUserById(mockId, [
        'firstName',
        'lastName',
        'email',
        'id',
        'role.id',
        'role.title',
        'permission.id',
        'permission.title',
        'permission.subject',
        'permission.action',
      ] as any); // Selecting fields

      expect(queryBuilderMock.select).toHaveBeenCalledWith([
        'user.firstName', // Selected user fields
        'user.lastName',
        'user.email',
        'user.id',
        'user.role.id',
        'user.role.title',
        'user.permission.id',
        'user.permission.title',
        'user.permission.subject',
        'user.permission.action',
        'role.id',
        'role.title',
        'permission.id',
        'permission.title',
        'permission.subject',
        'permission.action',
      ]);
      expect(result.id).toEqual(mockId);
      expect(userRepository.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(queryBuilderMock.getOne).toHaveBeenCalledTimes(1);
    });

    it('should handle error when user not found by Id', async () => {
      const mockId = 'non-existing-id';

      const queryBuilderMock = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue({}), // Simulate not found
      };

      jest
        .spyOn(userRepository, 'createQueryBuilder')
        .mockReturnValue(queryBuilderMock as any);

      expect(repository.findUserById(mockId)).toEqual(Promise.resolve({}));

      expect(queryBuilderMock.getOne).toHaveBeenCalledTimes(1);
    });

    it('should log error and throw BadRequestException on error', async () => {
      const mockId = 'some-id';
      const errorMessage = 'Database error';

      const queryBuilderMock = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockRejectedValue(new Error(errorMessage)), // Simulate a thrown error
      };

      jest
        .spyOn(userRepository, 'createQueryBuilder')
        .mockReturnValue(queryBuilderMock as any);

      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(); // Mock console.log

      await expect(repository.findUserById(mockId)).rejects.toThrow(
        new BadRequestException(
          'Failed to find user',
          AuthErrorCode.DATABASE_ERROR,
        ),
      );

      expect(consoleLogSpy).toHaveBeenCalledWith(expect.any(Error)); // Verify console.log was called
      expect(queryBuilderMock.getOne).toHaveBeenCalledTimes(1);

      consoleLogSpy.mockRestore(); // Restore console.log
    });
  });

  describe('Find User By Email', () => {
    it('should find a User by email with selected fields', async () => {
      const mockEmail = 'userMaster@gmail.com';
      const mockUser = mockUserExitData;

      // Mock the userRepository.findOne method
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

      const result = await repository.findUserByEmail(mockEmail, [
        'firstName',
        'lastName',
        'email',
        'id',
        'role.id',
        'role.title',
        'permission.id',
        'permission.title',
        'permission.subject',
        'permission.action',
      ] as any);

      expect(result.email).toEqual(mockEmail);
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: mockEmail },
        select: [
          'firstName', // Selected user fields
          'lastName',
          'email',
          'id',
          'role.id',
          'role.title',
          'permission.id',
          'permission.title',
          'permission.subject',
          'permission.action',
        ],
        relations: undefined, // Ensure relations are not set if not provided
      });
    });

    it('should return undefined when user not found by email', async () => {
      const mockEmail = 'non-existing-email@gmail.com';

      // Mocking findOne to return undefined for a non-existing user
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      const result = await repository.findUserByEmail(mockEmail);

      expect(result).toBeNull(); // Verify that result is null
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: mockEmail },
        select: undefined, // Ensure select is undefined
        relations: undefined, // Ensure relations are not set
      });
    });

    it('should handle error when an exception occurs', async () => {
      const mockEmail = 'error@example.com';
      const errorMessage = 'Database error';

      // Mocking findOne to throw an error
      jest
        .spyOn(userRepository, 'findOne')
        .mockRejectedValue(new Error(errorMessage));

      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(); // Mock console.log

      await expect(repository.findUserByEmail(mockEmail)).rejects.toThrow(
        new BadRequestException(
          'Failed to find user',
          AuthErrorCode.DATABASE_ERROR,
        ),
      );

      expect(consoleLogSpy).toHaveBeenCalledWith(expect.any(Error)); // Verify console.log was called
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: mockEmail },
        select: undefined, // Ensure select is undefined
        relations: undefined, // Ensure relations are not set
      });

      consoleLogSpy.mockRestore(); // Restore console.log
    });
  });

  describe('Find Users With Role Id', () => {
    it('should find users with a specific role Id', async () => {
      const mockRoleId = '93d13875-ae1d-4283-a877-ab1eac71e066';
      const usersWithRoleId = mockListUser.filter(
        (user) => user.role?.id === mockRoleId,
      );

      // Mock the find method of userRepository to return users with the specific role ID
      jest.spyOn(userRepository, 'find').mockResolvedValue(usersWithRoleId);

      const result = await repository.findUsersWithRoleId(mockRoleId);

      // Check that the returned result matches the expected users with the role ID
      expect(result).toEqual(usersWithRoleId);
      // Verify that the find method was called
      expect(userRepository.find).toHaveBeenCalledTimes(1);
      expect(userRepository.find).toHaveBeenCalledWith({
        where: {
          role: {
            id: mockRoleId,
          },
          isDelete: false,
        },
        select: {
          id: true,
          email: true,
          role: {
            id: true,
          },
        },
        relations: {
          role: true,
        },
      });
    });

    it('should handle error when finding users by role id fails', async () => {
      const mockRoleId = 'non-existing-role-id';

      // Mock the find method to throw an error
      jest
        .spyOn(userRepository, 'find')
        .mockRejectedValue(new Error('Database error'));

      await expect(repository.findUsersWithRoleId(mockRoleId)).rejects.toThrow(
        new BadRequestException(
          'Failed to find user with roleId',
          AuthErrorCode.DATABASE_ERROR,
        ),
      );

      // Ensure the find method was called
      expect(userRepository.find).toHaveBeenCalledTimes(1);
      expect(userRepository.find).toHaveBeenCalledWith({
        where: {
          role: {
            id: mockRoleId,
          },
          isDelete: false,
        },
        select: {
          id: true,
          email: true,
          role: {
            id: true,
          },
        },
        relations: {
          role: true,
        },
      });
    });
  });

  describe('Find Users With pagination', () => {
    it('should fetch all users with pagination', async () => {
      const userPagination: OffsetPaginationDto = {
        limit: 6,
        page: 1,
        sortOrder: SortOrder.ASC,
      };

      const mockUsers = mockListUser;
      jest.spyOn(userRepository, 'createQueryBuilder').mockReturnValue({
        select: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockUsers, 6]),
      } as any);

      const result = await repository.findAllUserWithPagination(
        userPagination,
        ['id', 'firstName', 'lastName', 'email'],
        ['role'],
      );

      expect(result).toEqual({
        data: mockListUser,
        pageNumber: userPagination.page,
        pageSize: userPagination.limit,
        totalCount: mockListUser.length,
      });
    });

    it('should handle database errors for findAllUserWithPagination', async () => {
      const userPagination: OffsetPaginationDto = {
        limit: 6,
        page: 1,
      };

      jest
        .spyOn(userRepository, 'createQueryBuilder')
        .mockImplementation(() => {
          throw new Error('Database error');
        });

      await expect(
        repository.findAllUserWithPagination(userPagination),
      ).rejects.toThrow(
        new BadRequestException(
          'Fetch users failed',
          AuthErrorCode.DATABASE_ERROR,
        ),
      );
    });
  });
});
