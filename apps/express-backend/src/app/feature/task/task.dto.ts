export interface CreateTaskDto {
  id: string;
  text: string;
  day: string;
  reminder: boolean;
}

export interface UpdateTaskDto {
  id?: string;
  text?: string;
  day?: string;
  reminder?: boolean;
}

export interface PaginationQueryDto {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
