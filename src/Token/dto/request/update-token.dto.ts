import { Token } from 'src/Token/entity/token.entity';
import { User } from 'src/user/entity/user.entity';

export class UpdateTokenDto implements Pick<Token, 'id' | 'user'> {
  id: string;
  user: User;
}
