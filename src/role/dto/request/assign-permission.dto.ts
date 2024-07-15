import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';

export class AssignPermissionPayload {
  @IsNotEmpty()
  @IsArray()
  permissions: string[];
}

export class AssignPermissionQuery {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}

export class AssignPermissionDTO {
  @ValidateNested()
  @Type(() => AssignPermissionPayload)
  data: AssignPermissionPayload;

  @ValidateNested()
  @Type(() => AssignPermissionQuery)
  query: AssignPermissionQuery;
}
