import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entity/permission.entity';
import { Repository } from 'typeorm';
import { CreatePermissionDTO } from './dto/create-permission.dto';

import { UpdatePermissionDTO } from './dto/update-permission.dto';
import { PermissionRepository } from './permission.repository';
import { NotFoundException } from '@khanhjoi/protos/dist/errors/http';
import { AuthErrorCode } from '@khanhjoi/protos/dist/errors/AuthError.enum';

@Injectable()
export class PermissionService {
  constructor(private permissionRepository: PermissionRepository) {}

  async getPermissions(): Promise<Permission[]> {
    const permissions = await this.permissionRepository.getPermissions();
    return permissions;
  }

  async getDetailPermission(id: string): Promise<Permission> {
    const permission = await this.permissionRepository.findPermissionWithId(id);
    return permission;
  }

  async createPermission(
    createPermission: CreatePermissionDTO,
  ): Promise<Permission> {
    const newPermission =
      await this.permissionRepository.createPermission(createPermission);
    return newPermission;
  }

  async updatePermission(
    id: string,
    updatePermissionDTO: UpdatePermissionDTO,
  ): Promise<Permission> {
    let permission = await this.permissionRepository.findPermissionWithId(id);

    if (!permission) {
      throw new NotFoundException(
        'Permission not found',
        AuthErrorCode.PERMISSION_FIND_FAILED,
      );
    }

    permission = {
      ...permission,
      ...updatePermissionDTO,
    };

    let updatePermission =
      await this.permissionRepository.updatePermission(permission);

    return updatePermission;
  }

  async deletePermission(id: string): Promise<Permission> {
    const permission = await this.permissionRepository.findPermissionWithId(id);

    if (!permission) {
      throw new NotFoundException(
        'Permission not found',
        AuthErrorCode.PERMISSION_FIND_FAILED,
      );
    }

    const permissionDeleted =
      await this.permissionRepository.deletePermission(permission);

    return permissionDeleted;
  }
}
