import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

export class DeletePermissionQuery {
  @IsNotEmpty()
  id: string;
}

export class DeletePermissionDTO {
  @ValidateNested()
  @Type(() => DeletePermissionQuery)
  query: DeletePermissionQuery;
}
