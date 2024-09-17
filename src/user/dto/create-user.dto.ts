import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { IUser } from '../interface/user.interface';

export class CreateUserDTO
  implements Pick<IUser, 'firstName' | 'lastName' | 'email' | 'password'>
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

  @IsStrongPassword()
  password: string;
}
