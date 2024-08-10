import { User } from 'src/user/entity/user.entity';

export interface IRefreshToken {
  id: string;
  expiresAt: Date;
  user: User;
}
