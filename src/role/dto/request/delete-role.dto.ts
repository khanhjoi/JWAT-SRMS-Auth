import { Type } from 'class-transformer';
import { IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';

export class DeleteQueryDTO {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}

export class DeleteRoleDTO {
  @ValidateNested()
  @Type(() => DeleteQueryDTO)
  query: DeleteQueryDTO;
}
