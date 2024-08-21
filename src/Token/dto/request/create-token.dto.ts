import { IToken } from 'src/Token/entity/token.interface';
import { User } from 'src/user/entity/user.entity';

export class CreateTokenDto implements Pick<IToken, 'id' | 'user'> {
  id: string;
  user: User;
}

