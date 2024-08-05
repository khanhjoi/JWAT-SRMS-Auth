
import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeletePermissionDTO {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
