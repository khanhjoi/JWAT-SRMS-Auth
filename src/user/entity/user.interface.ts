import { Role } from 'src/role/entity/role.entity';

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  refreshToken: string | null;
  password: string;
  role: Role;
}
