import { IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';

export class DeleteRoleDTO {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
