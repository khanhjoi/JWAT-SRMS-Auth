import { IsNotEmpty, IsString } from 'class-validator';
import { IRole } from 'src/role/entity/role.interface';

export class CreateRoleDTO
  implements
    Omit<IRole, 'id' | 'users' | 'createdAt' | 'permissions' | 'active'>
{
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
