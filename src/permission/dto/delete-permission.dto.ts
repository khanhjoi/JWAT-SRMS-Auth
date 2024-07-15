import { Type } from 'class-transformer';
import { IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';

export class DeletePermissionQuery {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}

export class DeletePermissionDTO {
  @ValidateNested()
  @Type(() => DeletePermissionQuery)
  query: DeletePermissionQuery;
}
