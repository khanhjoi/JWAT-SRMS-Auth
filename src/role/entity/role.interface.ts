
import { User } from 'src/user/entity/user.entity';

export interface RoleInterface {
  id: string;
  title: string;
  description: string;
  active: boolean;
  createdAt: Date;
  users: User;
  permissions: Permissions[];
}
