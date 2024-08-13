import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Permission } from './entity/permission.entity';
import { In, Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePermissionDTO } from './dto/create-permission.dto';
import { permission } from 'process';

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
        throw new HttpException(
          'Get permissions failed',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async findPermissionWithId(id: string): Promise<Permission> {
    try {
      const permission = await this.permissionRepository.findOneBy({ id: id });
      return permission;
    } catch (error) {
      throw new HttpException(
        'Find permission with ID failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
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
        throw new HttpException(
          'Find permissions failed',
          HttpStatus.INTERNAL_SERVER_ERROR,
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
        throw new HttpException(
          'Create Permission failed',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async updatePermission(permission: Permission): Promise<Permission> {
    try {
      const updatePermission = await this.permissionRepository.save(permission);
      return updatePermission;
    } catch (error) {
      throw new HttpException(
        'Update permission failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
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
        throw new HttpException(
          'Delete permission failed',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
