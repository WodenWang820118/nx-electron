import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { Task } from '../../interfaces/task.interface';
import { environment } from '../../../environments/environment';

function resolveTaskApiUrl(): string {
  // In Electron we have nodeIntegration enabled for the main window, so env vars are accessible.
  try {
    const envTaskApiUrl = (globalThis as any)?.process?.env?.TASK_API_URL;
    if (typeof envTaskApiUrl === 'string' && envTaskApiUrl) return envTaskApiUrl;

    const envPort = (globalThis as any)?.process?.env?.PORT;
    if (typeof envPort === 'string' && envPort) return `http://localhost:${envPort}/tasks`;
  } catch {
    // ignore
  }

  // Electron can pass overrides via query string: index.html?taskApiUrl=http://localhost:5000/tasks
  try {
    const search = (globalThis as any)?.location?.search;
    if (typeof search === 'string' && search) {
      const value = new URLSearchParams(search).get('taskApiUrl');
      if (value) return value;
    }
  } catch {
    // ignore
  }

  return environment.taskApiUrl;
}

const TASK_API_URL = resolveTaskApiUrl();

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

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private readonly http: HttpClient) {}

  getTasks(params?: TaskQueryParams): Observable<PaginatedResponse<Task>> {
    let httpParams = new HttpParams();
    
    if (params?.page) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    if (params?.limit) {
      httpParams = httpParams.set('limit', params.limit.toString());
    }
    if (params?.search) {
      httpParams = httpParams.set('search', params.search);
    }

    return this.http
      .get<PaginatedResponse<Task>>(TASK_API_URL, { params: httpParams })
      .pipe(
        catchError((error) => {
          console.log('Error: ', error);
          throw error;
        })
      );
  }

  deleteTask(task: Task): Observable<Task> {
    return this.http.delete<Task>(`${TASK_API_URL}/${task.id}`).pipe(
      catchError((error) => {
        console.log('Error: ', error);
        return [];
      })
    );
  }

  updateTaskReminder(task: Task): Observable<Task> {
    return this.http
      .put<Task>(`${TASK_API_URL}/${task.id}`, task, httpOptions)
      .pipe(
        catchError((error) => {
          console.log('Error: ', error);
          return [];
        })
      );
  }

  addTask(task: Task): Observable<Task> {
    return this.http
      .post<Task>(`${TASK_API_URL}/create`, task, httpOptions)
      .pipe(
        catchError((error) => {
          console.log('Error: ', error);
          return [];
        })
      );
  }
}
