import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class DeleteQueryDTO {
  @IsNotEmpty()
  @IsString()
  id: string;
}

export class DeleteRoleDTO {
  @ValidateNested()
  @Type(() => DeleteQueryDTO)
  query: DeleteQueryDTO;
}
