// permission.repository.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { BadRequestException } from '@khanhjoi/protos/dist/errors/http';
import { AuthErrorCode } from '@khanhjoi/protos/dist/errors/AuthError.enum';
import { PermissionRepository } from '@/permission/permission.repository';
import { Permission } from '@/permission/entity/permission.entity';
import {
  mockPermission,
  mockPermissions,
  permissionInjectRepoMock,
} from './mocks/permission.repository.mock';
import { OffsetPaginationDto } from '@common/dto/offsetPagination.dto';
import { SortOrder } from '@common/enums/order.enum';

describe('PermissionRepository', () => {
  let permissionRepository: PermissionRepository;
  let repository: Repository<Permission>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionRepository,
        {
          provide: getRepositoryToken(Permission),
          useValue: permissionInjectRepoMock,
        },
      ],
    }).compile();

    permissionRepository =
      module.get<PermissionRepository>(PermissionRepository);
    repository = module.get<Repository<Permission>>(
      getRepositoryToken(Permission),
    );
  });

  describe('findPermissionsWithIds', () => {
    it('should find permissions by IDs', async () => {
      jest.spyOn(repository, 'findBy').mockResolvedValue(mockPermissions);

      const result = await permissionRepository.findPermissionsWithIds([
        mockPermission.id,
      ]);

      expect(result).toEqual(mockPermissions);
      expect(repository.findBy).toHaveBeenCalledWith({
        id: In([mockPermission.id]),
      });
    });

    it('should throw BadRequestException when finding permissions fails', async () => {
      jest
        .spyOn(repository, 'findBy')
        .mockRejectedValue(new Error('Database error'));

      await expect(
        permissionRepository.findPermissionsWithIds(['1']),
      ).rejects.toThrow(
        new BadRequestException(
          'Find permission with list id failed',
          AuthErrorCode.DATABASE_ERROR,
        ),
      );
    });
  });

  describe('getPermissions', () => {
    it('should return an array of permissions', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue(mockPermissions);

      const result = await permissionRepository.getPermissions();

      expect(result).toEqual(mockPermissions);
      expect(repository.find).toHaveBeenCalled();
    });

    it('should return an empty array when no permissions are found', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([]);

      const result = await permissionRepository.getPermissions();

      expect(result).toEqual([]);
      expect(repository.find).toHaveBeenCalled();
    });

    it('should throw BadRequestException if fetching permissions fails', async () => {
      jest
        .spyOn(repository, 'find')
        .mockRejectedValue(new Error('Database error'));

      await expect(permissionRepository.getPermissions()).rejects.toThrow(
        new BadRequestException(
          'Get permissions failed',
          AuthErrorCode.DATABASE_ERROR,
        ),
      );
    });
  });

  describe('createPermission', () => {
    it('should create a permission', async () => {
      jest.spyOn(repository, 'save').mockResolvedValue(mockPermission);

      const result =
        await permissionRepository.createPermission(mockPermission);

      expect(result).toEqual(mockPermission);
      expect(repository.save).toHaveBeenCalledWith(mockPermission);
    });

    it('should throw BadRequestException if creating permission fails', async () => {
      jest
        .spyOn(repository, 'save')
        .mockRejectedValue(new Error('Database error'));

      await expect(
        permissionRepository.createPermission(mockPermission),
      ).rejects.toThrow(
        new BadRequestException(
          'Create database failed',
          AuthErrorCode.DATABASE_ERROR,
        ),
      );
    });
  });

  describe('updatePermission', () => {
    it('should update a permission', async () => {
      jest.spyOn(repository, 'save').mockResolvedValue(mockPermission);

      const result =
        await permissionRepository.updatePermission(mockPermission);

      expect(result).toEqual(mockPermission);
      expect(repository.save).toHaveBeenCalledWith(mockPermission);
    });

    it('should throw BadRequestException if updating permission fails', async () => {
      jest
        .spyOn(repository, 'save')
        .mockRejectedValue(new Error('Database error'));

      await expect(
        permissionRepository.updatePermission(mockPermission),
      ).rejects.toThrow(
        new BadRequestException(
          'Upload database failed',
          AuthErrorCode.DATABASE_ERROR,
        ),
      );
    });
  });

  describe('deletePermission', () => {
    it('should delete a permission', async () => {
      jest.spyOn(repository, 'remove').mockResolvedValue(mockPermission);

      const result =
        await permissionRepository.deletePermission(mockPermission);

      expect(result).toEqual(mockPermission);
      expect(repository.remove).toHaveBeenCalledWith(mockPermission);
    });

    it('should throw BadRequestException if deleting permission fails', async () => {
      jest
        .spyOn(repository, 'remove')
        .mockRejectedValue(new Error('Database error'));

      await expect(
        permissionRepository.deletePermission(mockPermission),
      ).rejects.toThrow(
        new BadRequestException(
          'Delete permission failed',
          AuthErrorCode.DATABASE_ERROR,
        ),
      );
    });
  });

  describe('getPermissionsWithPagination', () => {
    const paginationDto: OffsetPaginationDto = {
      limit: 5,
      page: 1,
      search: 'test',
      sortOrder: SortOrder.ASC,
    };

    it('should return paginated permissions with selected fields', async () => {
      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
        select: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest
          .fn()
          .mockResolvedValue([mockPermissions, mockPermissions.length]),
      } as any);

      const result = await permissionRepository.getPermissionsWithPagination(
        paginationDto,
        ['title', 'subject'],
      );

      expect(result).toEqual({
        data: mockPermissions,
        totalCount: mockPermissions.length,
        pageNumber: paginationDto.page,
        pageSize: paginationDto.limit,
      });
      expect(repository.createQueryBuilder).toHaveBeenCalledWith('permission');
      expect(repository.createQueryBuilder().select).toHaveBeenCalledWith([
        'permission.title',
        'permission.subject',
      ]);
    });

    it('should include search in the query if search term is provided', async () => {
      const queryBuilderMock = {
        select: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest
          .fn()
          .mockResolvedValue([mockPermissions, mockPermissions.length]),
      };

      jest
        .spyOn(repository, 'createQueryBuilder')
        .mockReturnValue(queryBuilderMock as any);

      await permissionRepository.getPermissionsWithPagination(paginationDto);

      expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
        `(permission.title LIKE :search OR permission.subject LIKE :search)`,
        { search: `%${paginationDto.search}%` },
      );
    });
  });

  // Add similar tests for createPermission, updatePermission, deletePermission, etc.
});
