import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { Task } from '../../interfaces/task.interface';
import { environment } from '../../../environments/environment';

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
      .get<PaginatedResponse<Task>>(environment.taskApiUrl, { params: httpParams })
      .pipe(
        catchError((error) => {
          console.log('Error: ', error);
          throw error;
        })
      );
  }

  deleteTask(task: Task): Observable<Task> {
    return this.http.delete<Task>(`${environment.taskApiUrl}/${task.id}`).pipe(
      catchError((error) => {
        console.log('Error: ', error);
        return [];
      })
    );
  }

  updateTaskReminder(task: Task): Observable<Task> {
    return this.http
      .put<Task>(`${environment.taskApiUrl}/${task.id}`, task, httpOptions)
      .pipe(
        catchError((error) => {
          console.log('Error: ', error);
          return [];
        })
      );
  }

  addTask(task: Task): Observable<Task> {
    return this.http
      .post<Task>(`${environment.taskApiUrl}/create`, task, httpOptions)
      .pipe(
        catchError((error) => {
          console.log('Error: ', error);
          return [];
        })
      );
  }
}
