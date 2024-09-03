
export interface IOffsetPaginatedType<T> {
  data: T[];
  totalCount: number;
  pageSize?: number;
  pageNumber?: number;
}

