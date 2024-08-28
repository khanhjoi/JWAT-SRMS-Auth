
import { Role } from 'src/role/entity/role.entity';
import { Token } from 'src/Token/entity/token.entity';

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  tokens: Token;
  password: string;
  role: Role;
}
