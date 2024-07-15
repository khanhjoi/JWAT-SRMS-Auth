import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePermissionDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
