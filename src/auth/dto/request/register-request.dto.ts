import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  ValidateNested,
} from 'class-validator';

export class RegisterRequestPayload {
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

export class RegisterRequestDTO {
  @ValidateNested()
  @Type(() => RegisterRequestPayload)
  data: RegisterRequestPayload;
}
