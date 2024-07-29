import {
  IsBoolean,
  isBoolean,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';
import { IPermission } from '../entity/permission.interface';

export class UpdatePermissionDTO implements Omit<IPermission, 'createdAt'> {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsBoolean()
  @IsNotEmpty()
  active: boolean;
}
