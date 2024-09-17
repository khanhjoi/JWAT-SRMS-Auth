import { IsNotEmpty, IsString } from 'class-validator';
import { IUser } from 'src/user/interface/user.interface';

export class ForgotPasswordDTO implements Pick<IUser, 'email'> {
  @IsNotEmpty()
  @IsString()
  email: string;
}
