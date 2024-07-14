import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class UpdateRolePayload {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;
  active?: boolean;
}

export class UpdateRoleQuery {
  @IsNotEmpty()
  @IsString()
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
