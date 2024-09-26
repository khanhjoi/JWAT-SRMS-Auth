import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { IUser } from '../interface/user.interface';

export class UpdateProfileDto
  implements Omit<IUser, 'createdAt' | 'tokens' | 'role' | 'id' | 'isDelete'>
{
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.',
    },
  )
  password: string;
}
