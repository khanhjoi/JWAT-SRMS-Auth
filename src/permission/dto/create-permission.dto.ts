import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { IPermission } from '../entity/permission.interface';
import { Action } from 'src/common/enums/action.enum';

export class CreatePermissionDTO
  implements Omit<IPermission, 'id' | 'active' | 'createdAt' | 'condition'>
{
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsEnum(Action)
  action: Action;

  @IsNotEmpty()
  @IsString()
  subject: string;

  
}
