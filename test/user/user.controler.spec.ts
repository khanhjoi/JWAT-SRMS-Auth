import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '@user/user.controller';
import { UserService } from 'src/user/user.service';
import { userServiceMock } from './mocks/user.mockService.mock';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@khanhjoi/protos'; // Assuming AuthGuard is defined in your custom proto package
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { mockListUser } from './mocks';
import { UpdateProfileDto } from '@user/dto/update-profile.dto';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  // Mock the AuthGuard to bypass authentication logic in tests
  class MockAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      return true; // Allow all requests
    }
  }

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
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: userServiceMock, // Mocked user service
        },
        JwtService,
        ConfigService,
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);

    jest.restoreAllMocks();
  });

  describe('getProfile', () => {
    it('should return the user profile without the password', async () => {
      const mockUserId = '1132e528-c197-48a9-828d-004f1c52b028';
      const mockRequest = { user: { sub: mockUserId } };
      const resultUser = mockListUser.find((user) => user.id === mockUserId);

      jest.spyOn(service, 'findUserById');
      jest.spyOn(controller, 'getProfile');

      const result = await controller.getProfile(mockRequest as any);

      // Ensure the service was called correctly
      expect(service.findUserById).toHaveBeenCalledWith(mockUserId, [
        'id',
        'lastName',
        'firstName',
        'email',
        'createdAt',
        'role',
        'isDelete',
      ]);
      expect(service.findUserById).toHaveBeenCalledTimes(1);

      // Expect the result to have no password
      expect(result).toEqual(resultUser);
      expect(controller.getProfile).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateProfile', () => {
    it('should update the user profile', async () => {
      const mockUserId = '1132e528-c197-48a9-828d-004f1c52b028';
      const mockRequest = { user: { sub: mockUserId } };
      const mockUpdateProfileDto: UpdateProfileDto = {
        firstName: 'Updated',
        lastName: 'User',
        email: 'updated.email@example.com',
        password: '',
      };
      
      jest.spyOn(service, 'updateProfileUser');

      const updateUserResult = await service.updateProfileUser(
        mockUserId,
        mockUpdateProfileDto,
      );

      const result = await controller.updateProfile(
        mockRequest as any,
        mockUpdateProfileDto,
      );

      // Expect service
      expect(service.updateProfileUser).toHaveBeenCalledWith(
        mockUserId,
        mockUpdateProfileDto,
      );
      expect(service.updateProfileUser).toHaveBeenCalledTimes(2);

      // Expect result
      expect(result).toEqual(updateUserResult);
    });
  });
});
