export class PaginationQueryDto {
  page?: number = 1;
  limit?: number = 10;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
