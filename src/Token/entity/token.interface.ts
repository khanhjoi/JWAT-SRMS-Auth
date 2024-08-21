import { TypeToken } from 'src/common/enums/typeToken.enum';
import { User } from 'src/user/entity/user.entity';

export interface IToken {
  id: string;

  token: string;

  type: TypeToken;

  expiresAt: Date;

  user: User;
}
