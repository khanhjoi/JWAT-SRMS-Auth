import { userInfo } from 'os';
import { IUser } from 'src/user/entity/user.interface';

export type AuthResponse = TokenType & {
  userInfo: UserInfoAuthResponse;
};

export type TokenType = {
  accessToken: string;
  refreshToken: string;
};

export class UserInfoAuthResponse
  implements Pick<IUser, 'firstName' | 'lastName' | 'email'>
{
  firstName: string;
  lastName: string;
  email: string;
}
