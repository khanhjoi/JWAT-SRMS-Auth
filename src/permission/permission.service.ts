import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

  async getPermissions(): Promise<Permission[]> {
    const permissions = await this.permissionRepository.getPermissions();
    return permissions;
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
      throw new HttpException('Permission not found', HttpStatus.NOT_FOUND);
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
      throw new HttpException('Permission not found', HttpStatus.NOT_FOUND);
    }

    const permissionDeleted =
      await this.permissionRepository.deletePermission(permission);

    return permissionDeleted;
  }
}
