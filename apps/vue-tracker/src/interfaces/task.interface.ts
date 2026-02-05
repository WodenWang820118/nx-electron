export interface Task {
  id: string;
  text: string;
  day: Date | null;
  reminder: boolean;
}

export interface CreateTaskDto {
  id: string;
  text: string;
  day: string;
  reminder: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TaskQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}
