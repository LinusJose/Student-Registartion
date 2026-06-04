import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  course: string;
  registrationDate: string;
}

export interface ApiResponse {
  status: string;
  message: string;
  response: Student[];
}

@Component({
  selector: 'app-student-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.css',
})
export class StudentDashboard implements OnInit {
  private readonly http = inject(HttpClient);

  students = signal<Student[]>([]);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  ngOnInit() {
    this.fetchStudents();
  }

  fetchStudents() {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.http.get<ApiResponse>('https://localhost:7069/api/student/GetStudents').subscribe({
      next: (data) => {
        if (data && data.status === 'Success') {
          this.students.set(data.response || []);
        } else {
          this.errorMessage.set(data?.message || 'Failed to retrieve students');
        }
        this.isLoading.set(false);


      },
      error: () => {
        this.errorMessage.set('Could not fetch student data. Please check if the API server is running.');
        this.isLoading.set(false);
        
      }
    });
  }
  // Method to delete a student by their ID
  deleteStudent(id: number) {
    // 1. Show a confirmation dialog so the user doesn't delete by accident
    const confirmDelete = confirm(`Are you sure you want to delete student #${id}?`);
    
    if (confirmDelete) {
      // 2. Make a DELETE request to your C# API
      this.http.delete(`https://localhost:7069/api/student/StudentDelete/${id}`)
        .subscribe({
          next: (response: any) => {
            if (response && response.status === 'Success') {
              alert('Student deleted successfully!');
              
              // 3. Refresh the table list so the deleted student disappears
              this.fetchStudents();
            } else {
              alert('Failed to delete student: ' + response.message);
            }
          },
          error: (err) => {
            console.error('Delete error:', err);
            alert('An error occurred. Make sure your C# API backend is running!');
          }
        });
    }
  }

}
