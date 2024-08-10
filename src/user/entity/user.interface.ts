import { RefreshToken } from 'src/RefreshToken/entity/refresh-token.entity';
import { Role } from 'src/role/entity/role.entity';

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  refreshTokens: RefreshToken;
  password: string;
  role: Role;
}
