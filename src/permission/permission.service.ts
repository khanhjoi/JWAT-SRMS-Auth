import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entity/permission.entity';
import { Repository } from 'typeorm';
import { CreatePermissionDTO } from './dto/create-permission.dto';

import { RpcException } from '@nestjs/microservices';
import { DeletePermissionDTO } from './dto/delete-permission.dto';
import { UpdatePermissionDTO } from './dto/update-permission.dto';
import { PermissionRepository } from './permission.repository';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private permissionRep: Repository<Permission>,
    private permissionRepository: PermissionRepository,
  ) {}

  async getPermissions(): Promise<{ permissions: Permission[] }> {
    const permissions = await this.permissionRepository.getPermissions();
    return { permissions: permissions };
  }

  async createPermission(
    createPermission: CreatePermissionDTO,
  ): Promise<{ permission: Permission }> {
    const newPermission =
      await this.permissionRepository.createPermission(createPermission);
    return { permission: newPermission };
  }

  async updatePermission(
    updatePermissionDTO: UpdatePermissionDTO,
  ): Promise<{ permission: Permission }> {
    let permission = await this.permissionRepository.findPermissionWithId(
      updatePermissionDTO.id,
    );

    if (!permission) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Permission not found',
      });
    }

    permission = {
      ...permission,
      ...updatePermissionDTO,
    };

    let updatePermission =
      await this.permissionRepository.updatePermission(permission);

    return { permission: updatePermission };
  }

  async deletePermission(id: string): Promise<{ permission: Permission }> {
    const permission = await this.permissionRepository.findPermissionWithId(id);

    if (!permission) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Permission not found',
      });
    }

    const permissionDeleted =
      await this.permissionRepository.DeletePermissionDTO(permission);

    return { permission: permissionDeleted };
  }
}
