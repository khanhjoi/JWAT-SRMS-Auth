import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { IUser } from '../interface/user.interface';

export class UpdateUserByAdminDTO
  implements
    Pick<IUser, 'id' | 'firstName' | 'lastName' | 'email' >
{
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsEmail()
  email: string;
}
