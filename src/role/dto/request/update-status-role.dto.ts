import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateStatusRole {
  @IsNotEmpty()
  @IsBoolean()
  status: boolean;
}
