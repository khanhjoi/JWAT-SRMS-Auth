import {
  IsBoolean,
  isBoolean,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';
import { IPermission } from '../interface/permission.interface';
import { EAction } from '../../common/enums/action.enum';

export class UpdatePermissionDTO
  implements Omit<IPermission, 'createdAt' | 'id' | 'condition'>
{
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsEnum(EAction)
  action: EAction;

  @IsNotEmpty()
  @IsString()
  subject: string;

  @IsBoolean()

  active: boolean;
}
