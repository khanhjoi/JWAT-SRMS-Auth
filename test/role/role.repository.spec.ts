import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  NotFoundException,
} from '@khanhjoi/protos/dist/errors/http';
import { AuthErrorCode } from '@khanhjoi/protos/dist/errors/AuthError.enum';
import { RoleRepository } from '@/role/role.repository';
import { Role } from '@/role/entity/role.entity';
import { CreateRoleDTO } from '@/role/dto/request/create-role.dto';
import { mockCreateRoleDto, mockRole, mockRoles } from './mocks/role.data.mock';
import { roleInjectRepoMock } from './mocks/role.repository.mock';
import { OffsetPaginationDto } from '@common/dto/offsetPagination.dto';
import { SortOrder } from '@khanhjoi/protos';

describe('RoleRepository', () => {
  let roleRepository: RoleRepository;
  let repository: Repository<Role>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleRepository,
        {
          provide: getRepositoryToken(Role),
          useValue: roleInjectRepoMock,
        },
      ],
    }).compile();

    roleRepository = module.get<RoleRepository>(RoleRepository);
    repository = module.get<Repository<Role>>(getRepositoryToken(Role));
  });

  describe('findRoleById', () => {
    it('should find a role by ID', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockRole);

      const result = await roleRepository.findRoleById('1');

      expect(result).toEqual(mockRole);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        select: undefined,
      });
    });

    it('should find a role by ID with selected fields', async () => {
      const selectFields: (keyof Role)[] = ['id', 'title'];

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockRole);

      const result = await roleRepository.findRoleById('1', selectFields);

      expect(result).toEqual(mockRole);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        select: selectFields,
      });
    });

    it('should throw BadRequestException when finding role fails', async () => {
      jest
        .spyOn(repository, 'findOne')
        .mockRejectedValue(new Error('Database error'));

      await expect(roleRepository.findRoleById('1')).rejects.toThrow(
        new BadRequestException(
          'Find role failed',
          AuthErrorCode.DEFAULT_ERROR,
        ),
      );
    });
  });

  describe('getRoleByUserId', () => {
    // Adjust according to your Role structure
    it('should find a role by ID', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockRole);

      const result = await roleRepository.getRoleByUserId('1');

      expect(result).toEqual(mockRole);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        select: undefined,
      });
    });

    it('should find a role by ID with selected fields', async () => {
      const selectFields: (keyof Role)[] = ['id', 'title'];
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockRole);

      const result = await roleRepository.getRoleByUserId('1', selectFields);

      expect(result).toEqual(mockRole);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        select: selectFields,
      });
    });

    it('should handle error when finding role fails', async () => {
      jest
        .spyOn(repository, 'findOne')
        .mockRejectedValue(new Error('Database error'));

      await expect(roleRepository.getRoleByUserId('1')).rejects.toThrow(
        new BadRequestException(
          'Find role failed',
          AuthErrorCode.DEFAULT_ERROR,
        ),
      );
    });
  });

  describe('getRoles', () => {
    it('should return an array of roles', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue(mockRoles);

      const result = await roleRepository.getRoles();

      expect(result).toEqual(mockRoles);
      expect(repository.find).toHaveBeenCalled();
    });

    it('should return an empty array when no roles are found', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([]);

      const result = await roleRepository.getRoles();

      expect(result).toEqual([]);
      expect(repository.find).toHaveBeenCalled();
    });

    it('should handle errors when retrieving roles fails', async () => {
      jest
        .spyOn(repository, 'find')
        .mockRejectedValue(new Error('Find roles failed'));

      await expect(roleRepository.getRoles()).rejects.toThrow(
        new BadRequestException(
          'Find roles failed',
          AuthErrorCode.DEFAULT_ERROR,
        ),
      );
    });
  });

  describe('updateStatusRole', () => {
    it('should update the status of the role successfully', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockRole);
      jest
        .spyOn(repository, 'save')
        .mockResolvedValue({ ...mockRole, active: false });

      const result = await roleRepository.updateStatusRole('1', false);

      expect(result.active).toBe(false);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(repository.save).toHaveBeenCalledWith({
        ...mockRole,
        active: false,
      });
    });

    it('should throw BadRequestException if the role is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(roleRepository.updateStatusRole('1', false)).rejects.toThrow(
        new BadRequestException(
          'Update status role failed',
          AuthErrorCode.DEFAULT_ERROR,
        ),
      );

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should handle errors when updating the status fails', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockRole);
      jest
        .spyOn(repository, 'save')
        .mockRejectedValue(new Error('Update status role failed'));

      await expect(roleRepository.updateStatusRole('1', false)).rejects.toThrow(
        new BadRequestException(
          'Update status role failed',
          AuthErrorCode.DEFAULT_ERROR,
        ),
      );

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });

  describe('getRolesWithPagination', () => {
    const mockCount = mockRoles.length;

    const paginationDto: OffsetPaginationDto = {
      limit: 6,
      page: 1,
      search: undefined,
      sortOrder: undefined,
      sortOrderBy: undefined,
    };

    it('should return paginated roles', async () => {
      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
        select: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest
          .fn()
          .mockResolvedValue([mockRoles, mockRoles.length]),
      } as any);

      const result = await roleRepository.getRolesWithPagination(paginationDto);

      expect(result).toEqual({
        data: mockRoles,
        totalCount: mockCount,
        pageNumber: paginationDto.page,
        pageSize: paginationDto.limit,
      });
      expect(repository.createQueryBuilder).toHaveBeenCalledWith('role');
    });

    it('should return paginated roles with selected fields', async () => {
      const selectFields: (keyof Role)[] = ['id', 'title'];
      const paginationWithSelect: OffsetPaginationDto = {
        ...paginationDto,
      };

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
        select: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest
          .fn()
          .mockResolvedValue([mockRoles, mockRoles.length]),
      } as any);

      const result = await roleRepository.getRolesWithPagination(
        paginationWithSelect,
        selectFields,
      );

      expect(result).toEqual({
        data: mockRoles,
        totalCount: mockCount,
        pageNumber: paginationWithSelect.page,
        pageSize: paginationWithSelect.limit,
      });
    });

    it('should return paginated roles with relations', async () => {
      const relations: (keyof Role)[] = ['users'];
      const paginationWithRelations: OffsetPaginationDto = {
        ...paginationDto,
      };

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
        select: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest
          .fn()
          .mockResolvedValue([mockRoles, mockRoles.length]),
      } as any);

      const result = await roleRepository.getRolesWithPagination(
        paginationWithRelations,
        undefined,
        relations,
      );

      expect(result).toEqual({
        data: mockRoles,
        totalCount: mockCount,
        pageNumber: paginationWithRelations.page,
        pageSize: paginationWithRelations.limit,
      });
    });

    it('should handle search functionality', async () => {
      const search = 'Admin';
      const paginationWithSearch: OffsetPaginationDto = {
        ...paginationDto,
        search,
      };

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
        select: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest
          .fn()
          .mockResolvedValue([mockRoles, mockRoles.length]),
      } as any);

      const result =
        await roleRepository.getRolesWithPagination(paginationWithSearch);

      expect(result).toEqual({
        data: mockRoles,
        totalCount: mockCount,
        pageNumber: paginationWithSearch.page,
        pageSize: paginationWithSearch.limit,
      });
    });

    it('should handle sorting', async () => {
      const sortOrder = SortOrder.ASC;
      const paginationWithSort: OffsetPaginationDto = {
        ...paginationDto,
        sortOrder: sortOrder,
      };

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
        select: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest
          .fn()
          .mockResolvedValue([mockRoles, mockRoles.length]),
      } as any);

      const result =
        await roleRepository.getRolesWithPagination(paginationWithSort);

      expect(result).toEqual({
        data: mockRoles,
        totalCount: mockCount,
        pageNumber: paginationWithSort.page,
        pageSize: paginationWithSort.limit,
      });
    });

    it('should handle errors when finding roles fails', async () => {
      jest.spyOn(repository, 'createQueryBuilder').mockImplementation(() => {
        throw new Error('Database error');
      });

      await expect(
        roleRepository.getRolesWithPagination(paginationDto),
      ).rejects.toThrow(
        new BadRequestException(
          'Find role failed',
          AuthErrorCode.DEFAULT_ERROR,
        ),
      );
    });
  });

  describe('createRole', () => {
    it('should create a new role', async () => {
      jest.spyOn(repository, 'save').mockResolvedValue(mockRole);

      const result = await roleRepository.createRole(mockCreateRoleDto);

      expect(result).toEqual(mockRole);
      expect(repository.save).toHaveBeenCalledWith(mockCreateRoleDto);
    });

    it('should handle error when creating role fails', async () => {
      jest
        .spyOn(repository, 'save')
        .mockRejectedValue(new Error('Database error'));

      await expect(
        roleRepository.createRole(mockCreateRoleDto),
      ).rejects.toThrow(
        new BadRequestException(
          'Create role failed',
          AuthErrorCode.DEFAULT_ERROR,
        ),
      );
    });
  });

  describe('updateRole', () => {
    it('should update an existing role', async () => {
      jest.spyOn(repository, 'save').mockResolvedValue(mockRole);

      const result = await roleRepository.updateRole(mockRole);

      expect(result).toEqual(mockRole);
      expect(repository.save).toHaveBeenCalledWith(mockRole);
    });

    it('should handle error when updating role fails', async () => {
      jest
        .spyOn(repository, 'save')
        .mockRejectedValue(new Error('Database error'));

      await expect(roleRepository.updateRole(mockRole)).rejects.toThrow(
        new BadRequestException(
          'Update role failed',
          AuthErrorCode.DEFAULT_ERROR,
        ),
      );
    });
  });

  describe('deleteRole', () => {
    it('should delete an existing role', async () => {
      jest.spyOn(repository, 'remove').mockResolvedValue(mockRole);

      const result = await roleRepository.deleteRole(mockRole);

      expect(result).toEqual(mockRole);
      expect(repository.remove).toHaveBeenCalledWith(mockRole);
    });

    it('should handle foreign key violation error when deleting role', async () => {
      jest.spyOn(repository, 'remove').mockRejectedValue({ code: '23503' }); // Simulating foreign key violation

      await expect(roleRepository.deleteRole(mockRole)).rejects.toThrow(
        new BadRequestException(
          'Cannot delete role. It is being referenced by other entities.',
          AuthErrorCode.ROLE_DELETE_FAILED,
        ),
      );
    });

    it('should handle error when deleting role fails', async () => {
      jest
        .spyOn(repository, 'remove')
        .mockRejectedValue(new Error('Database error'));

      await expect(roleRepository.deleteRole(mockRole)).rejects.toThrow(
        new BadRequestException(
          'Delete role failed ',
          AuthErrorCode.DEFAULT_ERROR,
        ),
      );
    });
  });
});
