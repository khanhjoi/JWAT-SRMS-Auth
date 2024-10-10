import { Permission } from '@/permission/entity/permission.entity';
import { PermissionRepository } from '@/permission/permission.repository';
import { PermissionService } from '@/permission/permission.service';
import { Test, TestingModule } from '@nestjs/testing';

import { OffsetPaginationDto } from 'src/common/dto/offsetPagination.dto';
import { IOffsetPaginatedType } from 'src/common/interface/offsetPagination.interface';
import { mockPermission, mockPermissions } from './mocks';
import { NotFoundException } from '@khanhjoi/protos/dist/errors/http';
import { AuthErrorCode } from '@khanhjoi/protos/dist/errors/AuthError.enum';
import { CreatePermissionDTO } from '@/permission/dto/create-permission.dto';
import { UpdatePermissionDTO } from '@/permission/dto/update-permission.dto';

describe('PermissionService', () => {
  let service: PermissionService;
  let permissionRepository: jest.Mocked<PermissionRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionService,
        {
          provide: PermissionRepository,
          useValue: {
            getPermissionsWithPagination: jest.fn(),
            getPermissions: jest.fn(),
            findPermissionWithId: jest.fn(),
            createPermission: jest.fn(),
            updatePermission: jest.fn(),
            deletePermission: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PermissionService>(PermissionService);
    permissionRepository = module.get(PermissionRepository);
  });

  describe('getPermissionsWithPagination', () => {
    it('should return paginated permissions', async () => {
      const queryPagination: OffsetPaginationDto = { limit: 5, page: 1 };
      const mockPaginatedResult: IOffsetPaginatedType<Permission> = {
        data: mockPermissions,
        totalCount: mockPermissions.length,
      };

      permissionRepository.getPermissionsWithPagination.mockResolvedValue(
        mockPaginatedResult,
      );

      const result =
        await service.getPermissionsWithPagination(queryPagination);

      expect(result).toEqual(mockPaginatedResult);
      expect(
        permissionRepository.getPermissionsWithPagination,
      ).toHaveBeenCalledWith(queryPagination);
    });
  });

  describe('getPermissions', () => {
    it('should return all permissions', async () => {
      permissionRepository.getPermissions.mockResolvedValue(mockPermissions);

      const result = await service.getPermissions();

      expect(result).toEqual(mockPermissions);
      expect(permissionRepository.getPermissions).toHaveBeenCalledTimes(1);
    });
  });

  describe('getDetailPermission', () => {
    it('should return a permission when found', async () => {
      permissionRepository.findPermissionWithId.mockResolvedValue(
        mockPermission,
      );

      const result = await service.getDetailPermission(mockPermission.id);

      expect(result).toEqual(mockPermission);
      expect(permissionRepository.findPermissionWithId).toHaveBeenCalledWith(
        mockPermission.id,
      );
    });

    it('should throw NotFoundException if permission is not found', async () => {
      jest
        .spyOn(permissionRepository, 'findPermissionWithId')
        .mockRejectedValue(new Error('Permission not found'));

      await expect(
        service.getDetailPermission('non-existing-id'),
      ).rejects.toThrow(
        new NotFoundException(
          'Permission not found',
          AuthErrorCode.PERMISSION_FIND_FAILED,
        ),
      );
    });
  });

  describe('createPermission', () => {
    it('should create a new permission', async () => {
      const createPermissionDto: CreatePermissionDTO = mockPermission;

      permissionRepository.createPermission.mockResolvedValue(mockPermission);

      const result = await service.createPermission(createPermissionDto);

      expect(result).toEqual(mockPermission);
      expect(permissionRepository.createPermission).toHaveBeenCalledWith(
        createPermissionDto,
      );
    });
  });

  describe('updatePermission', () => {
    it('should update an existing permission', async () => {
      const updatePermissionDto: UpdatePermissionDTO = mockPermission;

      permissionRepository.findPermissionWithId.mockResolvedValue(
        mockPermission,
      );

      const updatedPermission = { ...mockPermission, ...updatePermissionDto };
      permissionRepository.updatePermission.mockResolvedValue(
        updatedPermission,
      );

      const result = await service.updatePermission(
        mockPermission.id,
        updatePermissionDto,
      );

      expect(result).toEqual(updatedPermission);
      expect(permissionRepository.findPermissionWithId).toHaveBeenCalledWith(
        mockPermission.id,
      );
      expect(permissionRepository.updatePermission).toHaveBeenCalledWith(
        updatedPermission,
      );
    });

    it('should throw NotFoundException if permission is not found', async () => {
      permissionRepository.findPermissionWithId.mockResolvedValue(null);

      await expect(
        service.updatePermission('non-existing-id', {} as UpdatePermissionDTO),
      ).rejects.toThrow(
        new NotFoundException(
          'Permission not found',
          AuthErrorCode.PERMISSION_FIND_FAILED,
        ),
      );
    });
  });

  describe('deletePermission', () => {
    it('should delete a permission', async () => {
      permissionRepository.findPermissionWithId.mockResolvedValue(
        mockPermission,
      );
      permissionRepository.deletePermission.mockResolvedValue(mockPermission);

      const result = await service.deletePermission(mockPermission.id);

      expect(result).toEqual(mockPermission);
      expect(permissionRepository.findPermissionWithId).toHaveBeenCalledWith(
        mockPermission.id,
      );
      expect(permissionRepository.deletePermission).toHaveBeenCalledWith(
        mockPermission,
      );
    });

    it('should throw NotFoundException if permission is not found', async () => {
      permissionRepository.findPermissionWithId.mockResolvedValue(null);

      await expect(service.deletePermission('non-existing-id')).rejects.toThrow(
        new NotFoundException(
          'Permission not found',
          AuthErrorCode.PERMISSION_FIND_FAILED,
        ),
      );
    });
  });
});
