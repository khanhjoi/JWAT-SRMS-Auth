import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { IUser } from '../entity/user.interface';
import { Role } from 'src/role/entity/role.entity';

export class UpdateUserDTO implements Omit<IUser, 'id' | 'refreshTokens'> {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  createdAt: Date;

  @IsString()
  refreshToken: string;

  @IsString()
  password: string;

  role: Role;
}
