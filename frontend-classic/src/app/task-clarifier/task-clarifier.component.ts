import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-clarifier',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './task-clarifier.component.html',
  styleUrls: ['./task-clarifier.component.css']
})
export class TaskClarifierComponent implements OnInit {
  task: string = '';
  steps: string | null = null;
  loading: boolean = false;
  answers: any[] = [];

  
  expandedAnswers = new Set<number>();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getAllAnswers();
  }

  submitTask(): void {
    if (!this.task.trim()) {
      alert('Please enter a task description.');
      return;
    }

    this.loading = true;

    this.http.post<any>('http://localhost:5000/api/clarify-task', { task: this.task }).subscribe({
      next: (res) => {
       
        this.steps = res.steps.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        this.task = '';
        this.loading = false;
        this.getAllAnswers();
      },
      error: (err) => {
        alert('Something went wrong: ' + err.error?.error || err.message);
        this.loading = false;
      }
    });
  }

  getAllAnswers(): void {
    this.http.get<any[]>('http://localhost:5000/api/answers').subscribe({
      next: (data) => {
        this.answers = data;
      },
      error: (err) => {
        console.error('Failed to fetch answers:', err);
      }
    });
  }

  clearAll(): void {
    this.task = '';
    this.steps = null;
  }

  
  toggleAnswer(id: number): void {
    if (this.expandedAnswers.has(id)) {
      this.expandedAnswers.delete(id);
    } else {
      this.expandedAnswers.add(id);
    }
  }

  isExpanded(id: number): boolean {
    return this.expandedAnswers.has(id);
  }
}
