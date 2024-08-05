import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';
import { IRole } from 'src/role/entity/role.interface';

export class UpdateRoleDTO
  implements Omit<IRole, 'createdAt' | 'users' | 'permissions'| 'id'>
{
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  permissions?: Permissions[];

  @IsNotEmpty()
  @IsBoolean()
  active: boolean;
}
