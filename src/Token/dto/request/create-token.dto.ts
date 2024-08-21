import { TypeToken } from 'src/common/enums/typeToken.enum';
import { IToken } from 'src/Token/entity/token.interface';
import { User } from 'src/user/entity/user.entity';

export class CreateTokenDto implements Pick<IToken, 'token' | 'user' | 'type'> {
  token: string;
  type: TypeToken;
  expiresAt: number;
  user: User;
}
