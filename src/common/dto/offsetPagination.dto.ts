import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { SortOrder } from '../enums/order.enum';
import { EOrderBy } from 'src/user/user.enum';

export class OffsetPaginationDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(20)
  limit: number = 6;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @Type(() => String)
  @IsString()
  @IsOptional()
  search?: string = '';

  @IsEnum(SortOrder)
  @IsOptional()
  sortOrder?: SortOrder = SortOrder.DESC;

  @IsEnum(EOrderBy)
  @IsOptional()
  sortOrderBy?: EOrderBy = EOrderBy.createdAt;
}
