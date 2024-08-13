import { Permission } from 'src/permission/entity/permission.entity';
import { User } from 'src/user/entity/user.entity';

export interface IRole {
  id: string;
  title: string;
  description: string;
  active: boolean;
  createdAt: Date;
  users: User[];
  permissions: Permission[];
}
