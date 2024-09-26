import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entity/role.entity';
import { Repository } from 'typeorm';
import { CreateRoleDTO } from './dto/request/create-role.dto';
import {
  BadRequestException,
  NotFoundException,
} from '@khanhjoi/protos/dist/errors/http';
import { AuthErrorCode } from '@khanhjoi/protos/dist/errors/AuthError.enum';
import { OffsetPaginationDto } from 'src/common/dto/offsetPagination.dto';
import { IOffsetPaginatedType } from 'src/common/interface/offsetPagination.interface';

@Injectable()
export class RoleRepository {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}

  async findRoleById(roleId: string, select?: (keyof Role)[]): Promise<Role> {
    try {
      const role = await this.roleRepository.findOne({
        where: { id: roleId },
        select: select || undefined,
      });

      return role;
    } catch (error) {
      if (error) {
        throw new BadRequestException(
          'Find role failed',
          AuthErrorCode.DEFAULT_ERROR,
        );
      }
    }
  }

  async getRolesWithPagination(
    queryPagination: OffsetPaginationDto,
    select?: (keyof Role)[],
    relations?: (keyof Role)[],
  ): Promise<IOffsetPaginatedType<Role>> {
    try {
      const { limit, page, search, sortOrder, sortOrderBy } = queryPagination;

      const queryBuilder = this.roleRepository.createQueryBuilder('role');

      // Get select if user want
      if (select) {
        queryBuilder.select(select.map((field) => `role.${field}`));
      }

      // get relations if user want
      if (relations) {
        relations.forEach((relation) => {
          queryBuilder.leftJoinAndSelect(`role.${relation}`, relation);
        });
      }

      if (search) {
        queryBuilder.andWhere(
          '(role.title LIKE :search OR role.description LIKE :search)',
          { search: `%${search}%` },
        );
      }

      if (sortOrder) {
        queryBuilder.orderBy(`role.${sortOrderBy || 'createdAt'}`, sortOrder);
      }

      queryBuilder.skip(limit * (page - 1)).take(limit);

      const [roles, itemCount] = await queryBuilder.getManyAndCount();

      return {
        data: roles,
        totalCount: itemCount,
        pageNumber: page,
        pageSize: limit,
      };
    } catch (error) {
      if (error) {
        throw new BadRequestException(
          'Find role failed',
          AuthErrorCode.DEFAULT_ERROR,
        );
      }
    }
  }

  async getRoles(): Promise<Role[]> {
    const roles = await this.roleRepository.find();
    return roles;
  }

  async updateRole(role: Role): Promise<Role> {
    try {
      const roleUpdate = await this.roleRepository.save(role);
      return roleUpdate;
    } catch (error) {
      if (error) {
        throw new BadRequestException(
          'Update role failed',
          AuthErrorCode.DEFAULT_ERROR,
        );
      }
    }
  }

  async updateStatusRole(roleId: string, status: boolean): Promise<Role> {
    try {
      const role = await this.roleRepository.findOne({
        where: {
          id: roleId,
        },
      });

      role.active = status;

      const roleUpdated = await this.roleRepository.save(role);

      return roleUpdated;
    } catch (error) {
      console.log(error);

      throw new BadRequestException(
        'Update status role failed',
        AuthErrorCode.DEFAULT_ERROR,
      );
    }
  }

  async createRole(createRoleDTO: CreateRoleDTO): Promise<Role> {
    try {
      const role = await this.roleRepository.save(createRoleDTO);
      return role;
    } catch (error) {
      console.log(error);

      throw new BadRequestException(
        'Create role failed',
        AuthErrorCode.DEFAULT_ERROR,
      );
    }
  }

  async deleteRole(role: Role): Promise<Role> {
    try {
      const roleDeleted = await this.roleRepository.remove(role);
      return roleDeleted;
    } catch (error) {
      if (error?.code === '23503') {
        // Foreign key violation
        throw new BadRequestException(
          'Cannot delete role. It is being referenced by other entities.',
          AuthErrorCode.ROLE_DELETE_FAILED,
        );
      }
      throw new BadRequestException(
        'Delete role failed ',
        AuthErrorCode.DEFAULT_ERROR,
      );
    }
  }
}
