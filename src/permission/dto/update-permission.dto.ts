import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class UpdatePermissionPayload {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}

export class UpdatePermissionQuery {
  @IsNotEmpty()
  @IsString()
  id: string;
}

export class UpdatePermissionDTO {
  @ValidateNested()
  @Type(() => UpdatePermissionPayload)
  data: UpdatePermissionPayload

  @ValidateNested()
  @Type(() => UpdatePermissionQuery)
  query: UpdatePermissionQuery
}
