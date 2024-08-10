import { IRefreshToken } from 'src/RefreshToken/entity/refresh-token.interface';
import { User } from 'src/user/entity/user.entity';

export class UpdateTokenDto implements Pick<IRefreshToken, 'id' | 'user'> {
  id: string;
  user: User;
}
