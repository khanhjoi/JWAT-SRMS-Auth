import { IsNotEmpty, IsString } from 'class-validator';
import { IPermission } from '../entity/permission.interface';

export class CreatePermissionDTO
  implements Omit<IPermission, 'id' | 'active' | 'createdAt'>
{
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
