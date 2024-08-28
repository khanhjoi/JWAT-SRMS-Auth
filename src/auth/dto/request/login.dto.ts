import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IUser } from 'src/user/entity/user.interface';

export class LoginRequestDTO implements Pick<IUser, 'email' | 'password'> {
  @IsString({ message: 'Email must be a string' })
  @IsNotEmpty({ message: 'Email should not be empty' })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'Password should not be empty' })
  @IsString({ message: 'Password must be a string' })
  password: string;
}
