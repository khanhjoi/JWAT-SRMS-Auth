import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';
import { Permission } from 'src/permission/entity/permission.entity';
import { IRole } from 'src/role/interface/role.interface';

export class UpdateRoleDTO
  implements Omit<IRole, 'createdAt' | 'users' | 'permissions' | 'id'>
{
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  permissions?: string[] | Permission[]| any;

  active: boolean;
}
