import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { BadRequestException } from '@khanhjoi/protos/dist/errors/http';
import { AuthErrorCode } from '@khanhjoi/protos/dist/errors/AuthError.enum';
import { OffsetPaginationDto } from 'src/common/dto/offsetPagination.dto';
import { IOffsetPaginatedType } from 'src/common/interface/offsetPagination.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  async findAllUserWithPagination(
    userQueryPagination: OffsetPaginationDto,
    select?: (keyof User)[],
    relations?: (keyof User)[],
  ): Promise<IOffsetPaginatedType<User>> {
    try {
      const { limit, page, search, sortOrder, sortOrderBy } =
        userQueryPagination;

      const queryBuilder = this.userRepository.createQueryBuilder('user');

      queryBuilder.where('user.email != :superAdminEmail', {
        superAdminEmail: this.configService.get<string>('super_Admin_Email'),
      });

      if (select) {
        queryBuilder.select(select.map((field) => `user.${field}`));
      }

      if (relations) {
        relations.forEach((relation) => {
          queryBuilder.leftJoinAndSelect(`user.${relation}`, relation);
        });
      }

      if (search) {
        const searchTerm = search.toLowerCase().replace(/\s/g, '');
        queryBuilder.andWhere(
          "(LOWER(REPLACE(user.firstName, ' ', '')) LIKE :search OR LOWER(REPLACE(user.lastName, ' ', '')) LIKE :search OR LOWER(REPLACE(user.email, ' ', '')) LIKE :search)",
          { search: `%${searchTerm}%` },
        );
      }

      if (sortOrder) {
        queryBuilder.orderBy(`user.${sortOrderBy || 'createdAt'}`, sortOrder);
      }

      queryBuilder.skip(limit * (page - 1)).take(limit);

      const [users, itemCount] = await queryBuilder.getManyAndCount();

      return {
        data: users,
        pageNumber: page,
        totalCount: itemCount,
        pageSize: limit,
      };
    } catch (error) {
      throw new BadRequestException(
        'Fetch users failed',
        AuthErrorCode.DATABASE_ERROR,
      );
    }
  }

  /**
   * this method create for find all user with role
   * Purpose: use to clear cache user when edit role
   * @param roleId
   * @returns ListUser with id, email, role
   */
  async findUsersWithRoleId(roleId: string): Promise<User[]> {
    try {
      const users = await this.userRepository.find({
        where: {
          role: {
            id: roleId,
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
      return users;
    } catch (error) {
      throw new BadRequestException(
        'Failed to find user with roleId',
        AuthErrorCode.DATABASE_ERROR,
      );
    }
  }

  async findUserByEmail(
    email: string,
    select?: (keyof User)[],
    relations?: any[],
  ): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
        select: select || undefined,
        relations: relations,
      });

      return user;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        'Failed to find user',
        AuthErrorCode.DATABASE_ERROR,
      );
    }
  }

  async findUserById(id: string, select?: (keyof User)[]): Promise<User> {
    try {
      const query = this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.role', 'role', 'role.active = true')
        .leftJoinAndSelect(
          'role.permissions',
          'permission',
          'role.active = true AND permission.active = true',
        )
        .where('user.id = :id', { id: id });

      if (select && select.length > 0) {
        query.select([
          ...select.map((field) => `user.${field}`),
          'role.id',
          'role.title',
          'permission.id',
          'permission.title',
          'permission.subject',
          'permission.action',
        ]);
      }

      const user = await query.getOne();

      return user;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        'Failed to find user',
        AuthErrorCode.DATABASE_ERROR,
      );
    }
  }

  async createNewUser(createUserDTO: CreateUserDTO): Promise<User> {
    try {
      const createdAt = new Date();

      const userData = {
        ...createUserDTO,
        createdAt,
      };
      
      const user = await this.userRepository.save(userData);
      return user;
    } catch (error) {
      throw new BadRequestException(
        'Create user failed',
        AuthErrorCode.DATABASE_ERROR,
      );
    }
  }

  async updateUser(user: User): Promise<User> {
    try {
      const userUpdate = await this.userRepository.save(user);
      return userUpdate;
    } catch (error) {
      throw new BadRequestException(
        'Update user failed',
        AuthErrorCode.DATABASE_ERROR,
      );
    }
  }
}
