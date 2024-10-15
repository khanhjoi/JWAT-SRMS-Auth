import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { IPermission } from '../interface/permission.interface';
import { EAction } from 'src/common/enums/action.enum';

export class CreatePermissionDTO
  implements Omit<IPermission, 'id' | 'active' | 'createdAt' | 'condition'>
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

  
}
