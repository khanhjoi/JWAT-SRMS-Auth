import { IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestDTO {
  @IsString({ message: 'Email must be a string' })
  @IsNotEmpty({ message: 'Email should not be empty' })
  email: string;

  @IsNotEmpty({ message: 'Password should not be empty' })
  @IsString({ message: 'Password must be a string' })
  password: string;
}
