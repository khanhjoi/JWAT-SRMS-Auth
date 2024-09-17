import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { IUser } from '../interface/user.interface';
import { Role } from 'src/role/entity/role.entity';

export class UpdateUserDTO implements Omit<IUser, 'id' | 'tokens'> {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  createdAt: Date;

  @IsNotEmpty()
  @IsBoolean()
  isDelete: boolean;

  @IsNotEmpty()
  @IsString()
  refreshToken: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  role: Role;
}
