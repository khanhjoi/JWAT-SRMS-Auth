import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class UpdateRolePayload {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsArray()
  permissions: Permissions[];

  active?: boolean;
}

export class UpdateRoleQuery {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}

export class UpdateRoleDTO {
  @ValidateNested()
  @Type(() => UpdateRolePayload) // this is important for nested check validation
  data: UpdateRolePayload;

  @ValidateNested()
  @Type(() => UpdateRoleQuery)
  query: UpdateRoleQuery;
}
