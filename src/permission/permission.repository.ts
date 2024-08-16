import { HttpStatus, Injectable } from '@nestjs/common';
import { Permission } from './entity/permission.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePermissionDTO } from './dto/create-permission.dto';
import { BadRequestException } from '@khanhjoi/protos/dist/errors/http';
import { AuthErrorCode } from '@khanhjoi/protos/dist/errors/AuthError.enum';

@Injectable()
export class PermissionRepository {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async getPermissions(): Promise<Permission[]> {
    try {
      const permissions = await this.permissionRepository.find();
      return permissions;
    } catch (error) {
      if (error) {
        throw new BadRequestException(
          'Get permissions failed',
          AuthErrorCode.DATABASE_ERROR,
        );
      }
    }
  }

  async findPermissionWithId(id: string): Promise<Permission> {
    try {
      const permission = await this.permissionRepository.findOneBy({ id: id });
      return permission;
    } catch (error) {
      throw new BadRequestException(
        'Find permission with id failed',
        AuthErrorCode.DATABASE_ERROR,
      );
    }
  }

  async findPermissionsWithIds(permissionIds: any[]): Promise<Permission[]> {
    try {
      const permissions = await this.permissionRepository.findBy({
        id: In(permissionIds),
      });
      return permissions;
    } catch (error) {
      if (error) {
        throw new BadRequestException(
          'Find permission with list id failed',
          AuthErrorCode.DATABASE_ERROR,
        );
      }
    }
  }

  async createPermission(
    CreatePermissionDTO: CreatePermissionDTO,
  ): Promise<Permission> {
    try {
      const permission =
        await this.permissionRepository.save(CreatePermissionDTO);
      return permission;
    } catch (error) {
      if (error) {
        throw new BadRequestException(
          'Create database failed',
          AuthErrorCode.DATABASE_ERROR,
        );
      }
    }
  }

  async updatePermission(permission: Permission): Promise<Permission> {
    try {
      const updatePermission = await this.permissionRepository.save(permission);
      return updatePermission;
    } catch (error) {
      throw new BadRequestException(
        'Upload database failed',
        AuthErrorCode.DATABASE_ERROR,
      );
    }
  }

  async deletePermission(permission: Permission): Promise<Permission> {
    try {
      const permissionDeleted =
        await this.permissionRepository.remove(permission);
      return permissionDeleted;
    } catch (error) {
      if (error) {
        throw new BadRequestException(
          'Delete permission failed',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
