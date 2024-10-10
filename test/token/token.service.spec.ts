import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from 'src/user/user.service';
import { TypeToken } from 'src/common/enums/typeToken.enum';
import { NotFoundException } from '@khanhjoi/protos/dist/errors/http';
import { DeleteResult } from 'typeorm';
import { TokenRepository } from '@/Token/token.repository';
import { TokenService } from '@/Token/token.service';
import { Token } from '@/Token/entity/token.entity';
import { mockToken, tokenInjectRepoMock } from './mocks/token.repository.mock';

describe('TokenService', () => {
  let tokenService: TokenService;
  let tokenRepository: TokenRepository;
  let userService: UserService;

  const mockUserService = {
    findUserByEmail: jest.fn(),
    findUserById: jest.fn(),
  };

  const mockTokenRepo = {
    findTokenWithToken: jest.fn(),
    createToken: jest.fn(),
    findTokenWithId: jest.fn(),
    deleteToken: jest.fn(),
    findTokenWithUserId: jest.fn(),
    updateToken: jest.fn(),

  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        { provide: TokenRepository, useValue: mockTokenRepo },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    tokenService = module.get<TokenService>(TokenService);
    tokenRepository = module.get<TokenRepository>(TokenRepository);
    userService = module.get<UserService>(UserService);
  });

  describe('findTokenByToken', () => {
    it('should return a token if found', async () => {
      jest
        .spyOn(tokenRepository, 'findTokenWithToken')
        .mockResolvedValue(mockToken);

      const result = await tokenService.findTokenByToken(
        mockToken.token,
        mockToken.type,
      );
      expect(result).toEqual(mockToken);
      expect(tokenRepository.findTokenWithToken).toHaveBeenCalledWith(
        mockToken.token,
        mockToken.type,
      );
    });

    it('should return null if no token is found', async () => {
      jest.spyOn(tokenRepository, 'findTokenWithToken').mockResolvedValue(null);

      const result = await tokenService.findTokenByToken(
        mockToken.token,
        mockToken.type,
      );
      expect(result).toBeNull();
      expect(tokenRepository.findTokenWithToken).toHaveBeenCalledWith(
        mockToken.token,
        mockToken.type,
      );
    });
  });

  describe('findTokenOfUserId', () => {
    it('should return a token for the given userId if found', async () => {
      jest
        .spyOn(tokenRepository, 'findTokenWithUserId')
        .mockResolvedValue(mockToken);

      const result = await tokenService.findTokenOfUserId(
        mockToken.user.id,
        TypeToken.REFRESH_TOKEN,
      );
      expect(result).toEqual(mockToken);
      expect(tokenRepository.findTokenWithUserId).toHaveBeenCalledWith(
        mockToken.user.id,
        TypeToken.REFRESH_TOKEN,
      );
    });

    it('should return null if no token is found for the given userId', async () => {
      jest
        .spyOn(tokenRepository, 'findTokenWithUserId')
        .mockResolvedValue(null);

      const result = await tokenService.findTokenOfUserId(
        mockToken.user.id,
        TypeToken.REFRESH_TOKEN,
      );
      expect(result).toBeNull();
      expect(tokenRepository.findTokenWithUserId).toHaveBeenCalledWith(
        mockToken.user.id,
        TypeToken.REFRESH_TOKEN,
      );
    });
  });

  describe('findTokenWithEmail', () => {
    it('should return a token for the given email if user is found', async () => {
      mockUserService.findUserByEmail.mockResolvedValue(mockToken.user);
      jest
        .spyOn(tokenRepository, 'findTokenWithUserId')
        .mockResolvedValue(mockToken);

      const result = await tokenService.findTokenWithEmail(
        mockToken.user.email,
        TypeToken.REFRESH_TOKEN,
      );
      expect(result).toEqual(mockToken);
      expect(mockUserService.findUserByEmail).toHaveBeenCalledWith(
        mockToken.user.email,
      );
      expect(tokenRepository.findTokenWithUserId).toHaveBeenCalledWith(
        mockToken.user.id,
        TypeToken.REFRESH_TOKEN,
      );
    });

    it('should return null if user is not found', async () => {
      mockUserService.findUserByEmail.mockResolvedValue('');

      const result = await tokenService.findTokenWithEmail(
        mockToken.user.email,
        TypeToken.REFRESH_TOKEN,
      );
      expect(result).toBeUndefined();
      expect(mockUserService.findUserByEmail).toHaveBeenCalledWith(
        mockToken.user.email,
      );
    });
  });

  describe('createRefreshToken', () => {
    it('should create a new refresh token', async () => {
      jest.spyOn(userService, 'findUserById').mockResolvedValue(mockToken.user);

      jest.spyOn(tokenRepository, 'createToken').mockResolvedValue(mockToken);

      const result = await tokenService.createRefreshToken(
        mockToken.user.id,
        mockToken.token,
      );
      expect(result).toEqual(mockToken);
    });
  });

  describe('deleteRefreshToken', () => {
    it('should delete the refresh token if it exists', async () => {
      jest
        .spyOn(tokenRepository, 'findTokenWithId')
        .mockResolvedValue(mockToken); // Assuming mockToken is defined above.

      // Create an instance of DeleteResult for mocking
      const mockDeleteResult = new DeleteResult();
      mockDeleteResult.affected = 1; // Setting the affected property.

      jest
        .spyOn(tokenRepository, 'deleteToken')
        .mockResolvedValue(mockDeleteResult);

      const result = await tokenService.deleteRefreshToken(mockToken.id);

      expect(result).toBeInstanceOf(DeleteResult);
      expect(tokenRepository.findTokenWithId).toHaveBeenCalledWith(
        mockToken.id,
        TypeToken.REFRESH_TOKEN,
      );
      expect(tokenRepository.deleteToken).toHaveBeenCalledWith(mockToken);
    });

    it('should throw a NotFoundException if the token does not exist', async () => {
      const tokenId = 'token-id';

      jest.spyOn(tokenRepository, 'findTokenWithId').mockResolvedValue(null);

      await expect(tokenService.deleteRefreshToken(tokenId)).rejects.toThrow(
        NotFoundException,
      );
      expect(tokenRepository.findTokenWithId).toHaveBeenCalledWith(
        tokenId,
        TypeToken.REFRESH_TOKEN,
      );
    });
  });

  describe('createResetToken', () => {
    it('should create a reset token for the given user', async () => {
      jest.spyOn(userService, 'findUserById').mockResolvedValue(mockToken.user);
      jest.spyOn(tokenRepository, 'createToken').mockResolvedValue(mockToken);

      const result = await tokenService.createResetToken(
        mockToken.user.id,
        mockToken.token,
      );

      expect(result).toEqual(mockToken);
      expect(userService.findUserById).toHaveBeenCalledWith(mockToken.user.id);
    });
  });

  describe('updateRefreshToken', () => {
    it('should update the refresh token expiration date', async () => {
      jest
        .spyOn(tokenRepository, 'findTokenWithId')
        .mockResolvedValue(mockToken);
      jest.spyOn(tokenRepository, 'updateToken').mockResolvedValue(mockToken);

      const result = await tokenService.updateRefreshToken(
        mockToken.id,
        mockToken.token,
      );

      expect(result).toEqual(mockToken);
      expect(tokenRepository.findTokenWithId).toHaveBeenCalledWith(
        mockToken.id,
        TypeToken.REFRESH_TOKEN,
      );
      expect(tokenRepository.updateToken).toHaveBeenCalledWith(mockToken);
    });
  });
});
