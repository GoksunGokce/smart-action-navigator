import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';



export interface QuestionAnswer {
  id: number;
  question: string;
  answer: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  clarifyTask(task: string): Observable<{ steps: string }> {
    return this.http.post<{ steps: string }>(`${this.baseUrl}/clarify-task`, { task });
  }

  getAnswers(): Observable<QuestionAnswer[]> {
    return this.http.get<QuestionAnswer[]>(`${this.baseUrl}/answers`);
  }
}

