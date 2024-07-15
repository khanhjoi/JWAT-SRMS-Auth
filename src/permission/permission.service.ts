import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entity/permission.entity';
import { Repository } from 'typeorm';
import { CreatePermissionDTO } from './dto/create-permission.dto';
import {
  UpdatePermissionPayload,
  UpdatePermissionQuery,
} from './dto/update-permission.dto';
import { RpcException } from '@nestjs/microservices';
import { DeletePermissionQuery } from './dto/delete-permission.dto';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async getPermissions(): Promise<Permission[]> {
    const permissions = await this.permissionRepository.find();
    return permissions;
  }

  async createPermission(
    createPermission: CreatePermissionDTO,
  ): Promise<Permission> {
    const permission = await this.permissionRepository.save(createPermission);
    return permission;
  }

  async updatePermission(
    updatePermissionPayload: UpdatePermissionPayload,
    updatePermissionQuery: UpdatePermissionQuery,
  ): Promise<Permission> {
    let permission = await this.permissionRepository.findOneBy({
      id: updatePermissionQuery.id,
    });

    if (!permission) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Permission not found',
      });
    }

    permission = {
      ...permission,
      ...updatePermissionPayload,
    };

    let updatePermission = await this.permissionRepository.save(permission);

    return updatePermission;
  }

  async deletePermission(
    deletePermissionQuery: DeletePermissionQuery,
  ): Promise<Permission> {
    const permission = await this.permissionRepository.findOneBy({
      id: deletePermissionQuery.id,
    });

    if (!permission) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Permission not found',
      });
    }

    const permissionDeleted = this.permissionRepository.remove(permission);

    return permissionDeleted;
  }
}
