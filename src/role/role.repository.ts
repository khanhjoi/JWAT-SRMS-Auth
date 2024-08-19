import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entity/role.entity';
import { Repository } from 'typeorm';
import { CreateRoleDTO } from './dto/request/create-role.dto';
import { BadRequestException } from '@khanhjoi/protos/dist/errors/http';
import { AuthErrorCode } from '@khanhjoi/protos/dist/errors/AuthError.enum';

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

  async getRoles(): Promise<Role[]> {
    try {
      const roles = await this.roleRepository.find({
        relations: {
          permissions: true,
        },
      });
      return roles;
    } catch (error) {
      if (error) {
        throw new BadRequestException(
          'Find role failed',
          AuthErrorCode.DEFAULT_ERROR,
        );
      }
    }
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

  async createRole(createRoleDTO: CreateRoleDTO): Promise<Role> {
    try {
      const role = await this.roleRepository.save(createRoleDTO);
      return role;
    } catch (error) {
      if (error) {
        throw new BadRequestException(
          'Create role failed',
          AuthErrorCode.DEFAULT_ERROR,
        );
      }
    }
  }

  async deleteRole(role: Role): Promise<Role> {
    try {
      const roleDeleted = await this.roleRepository.remove(role);
      return roleDeleted;
    } catch (error) {
      if (error) {
        throw new BadRequestException(
          'Delete role failed',
          AuthErrorCode.DEFAULT_ERROR,
        );
      }
    }
  }
}
