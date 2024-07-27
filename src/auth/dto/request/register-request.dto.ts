import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { IUser } from 'src/user/entity/user.interface';

export class RegisterRequestDTO
  implements Omit<IUser, 'id' | 'createdAt' | 'role'>
{
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  refreshToken: string;

  @IsStrongPassword()
  password: string;
}
