import { IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestDTO {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
