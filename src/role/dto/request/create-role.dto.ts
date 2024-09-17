import { IsNotEmpty, IsString } from 'class-validator';
import { IRole } from 'src/role/interface/role.interface';

export class CreateRoleDTO implements Pick<IRole, 'title' | 'description'> {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
