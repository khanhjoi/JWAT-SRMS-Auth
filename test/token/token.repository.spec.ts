import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@khanhjoi/protos/dist/errors/http';
import { AuthErrorCode } from '@khanhjoi/protos/dist/errors/AuthError.enum';
import { mockToken, tokenInjectRepoMock } from './mocks/token.repository.mock';
import { TokenRepository } from '@/Token/token.repository';
import { TypeToken } from '@khanhjoi/protos';
import { Token } from '@/Token/entity/token.entity';
import { Repository } from 'typeorm';

describe('TokenRepository', () => {
  let tokenRepository: TokenRepository;
  let repository: Repository<Token>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenRepository,
        {
          provide: getRepositoryToken(Token),
          useValue: tokenInjectRepoMock,
        },
      ],
    }).compile();

    tokenRepository = module.get<TokenRepository>(TokenRepository);
    repository = module.get<Repository<Token>>(getRepositoryToken(Token));
  });

  describe('findTokenWithId', () => {
    it('should find a token by ID', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockToken);

      const result = await tokenRepository.findTokenWithId(
        mockToken.id,
        TypeToken.REFRESH_TOKEN,
      );

      expect(result).toEqual(mockToken);
    });

    it('should throw BadRequestException when finding token by ID fails', async () => {
      jest
        .spyOn(repository, 'findOne')
        .mockRejectedValue(new Error('Database error'));

      await expect(
        tokenRepository.findTokenWithId('invalid-id', TypeToken.REFRESH_TOKEN),
      ).rejects.toThrow(
        new BadRequestException(
          'Find Refresh Token Failed',
          AuthErrorCode.DATABASE_ERROR,
        ),
      );
    });
  });

  describe('findTokenWithUserId', () => {
    it('should find a token by user ID', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockToken as any);

      const result = await tokenRepository.findTokenWithUserId(
        mockToken.user.id,
        TypeToken.REFRESH_TOKEN,
      );

      expect(result).toEqual(mockToken);
    });

    it('should throw BadRequestException when finding token by user ID fails', async () => {
      jest
        .spyOn(repository, 'findOne')
        .mockRejectedValue(new Error('Database error'));

      await expect(
        tokenRepository.findTokenWithUserId(
          'invalid-user-id',
          TypeToken.REFRESH_TOKEN,
        ),
      ).rejects.toThrow(
        new BadRequestException(
          'Find Refresh Token Failed',
          AuthErrorCode.DATABASE_ERROR,
        ),
      );
    });
  });

  describe('createToken', () => {
    it('should create a new token', async () => {
      jest.spyOn(repository, 'save').mockResolvedValue(mockToken);

      const result = await tokenRepository.createToken({
        token: mockToken.token,
        type: mockToken.type,
        user: mockToken.user,
        expiresAt: 340000,
      });

      expect(result).toEqual(mockToken);
    });

    it('should throw BadRequestException when creating a token fails', async () => {
      jest
        .spyOn(repository, 'save')
        .mockRejectedValue(new Error('Create Refresh Token Failed'));

      await expect(
        tokenRepository.createToken({
          token: mockToken.token,
          type: mockToken.type,
          user: mockToken.user,
          expiresAt: 340000,
        }),
      ).rejects.toThrow(
        new BadRequestException(
          'Create Refresh Token Failed',
          AuthErrorCode.DATABASE_ERROR,
        ),
      );
    });
  });

  describe('updateToken', () => {
    it('should update an existing token', async () => {
      jest.spyOn(repository, 'save').mockResolvedValue(mockToken as any);

      const result = await tokenRepository.updateToken(mockToken);

      expect(result).toEqual(mockToken);
      expect(repository.save).toHaveBeenCalledWith(mockToken);
    });

    it('should throw BadRequestException when updating a token fails', async () => {
      jest
        .spyOn(repository, 'save')
        .mockRejectedValue(new Error('Database error'));

      await expect(tokenRepository.updateToken(mockToken)).rejects.toThrow(
        new BadRequestException(
          'Update Refresh Token Failed',
          AuthErrorCode.DATABASE_ERROR,
        ),
      );
    });
  });

  describe('deleteToken', () => {
    it('should delete a token', async () => {
      jest
        .spyOn(repository, 'delete')
        .mockResolvedValue({ affected: 1 } as any);

      const result = await tokenRepository.deleteToken(mockToken);

      expect(result).toEqual({ affected: 1 });
      expect(repository.delete).toHaveBeenCalledWith({
        id: mockToken.id,
        type: mockToken.type,
      });
    });

    it('should throw BadRequestException when deleting a token fails', async () => {
      jest
        .spyOn(repository, 'delete')
        .mockRejectedValue(new Error('Database error'));

      await expect(tokenRepository.deleteToken(mockToken)).rejects.toThrow(
        new BadRequestException(
          'Delete Refresh Token Failed',
          AuthErrorCode.DATABASE_ERROR,
        ),
      );
    });
  });
});
