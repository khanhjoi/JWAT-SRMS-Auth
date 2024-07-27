import { IsNotEmpty, IsString } from 'class-validator';
import { IUser } from 'src/user/entity/user.interface';

export class LoginRequestDTO
  implements
    Omit<
      IUser,
      'id' | 'createdAt' | 'role' | 'refreshToken' | 'firstName' | 'lastName'
    >
{
  @IsString({ message: 'Email must be a string' })
  @IsNotEmpty({ message: 'Email should not be empty' })
  email: string;

  @IsNotEmpty({ message: 'Password should not be empty' })
  @IsString({ message: 'Password must be a string' })
  password: string;
}
