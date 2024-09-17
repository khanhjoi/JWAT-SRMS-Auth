import { IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { IRole } from 'src/role/interface/role.interface';

export class DeleteRoleDTO
  implements
    Omit<
      IRole,
      | 'title'
      | 'description'
      | 'active'
      | 'createdAt'
      | 'users'
      | 'permissions'
    >
{
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
