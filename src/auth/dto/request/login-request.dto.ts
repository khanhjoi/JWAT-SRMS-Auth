import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class LoginRequestPayload {
  @IsString({ message: 'Email must be a string' })
  @IsNotEmpty({ message: 'Email should not be empty' })
  email: string;

  @IsNotEmpty({ message: 'Password should not be empty' })
  @IsString({ message: 'Password must be a string' })
  password: string;
}

export class LoginRequestDTO {
  @ValidateNested()
  @Type(() => LoginRequestPayload)
  data: LoginRequestPayload
}
