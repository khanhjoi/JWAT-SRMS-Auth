import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Permission } from './entity/permission.entity';
import { In, Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PermissionRepository {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async findPermissionsWithIds(permissionIds: any[]):Promise<any[]> {
    try {
      const permissions =
        await this.permissionRepository.findBy({id: In(permissionIds)})
      return permissions;
    } catch (error) {
      if (error) {
        throw new RpcException({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Find permissions failed',
        });
      }
    }
  }
}
