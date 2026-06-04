import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-registration',
  imports: [FormsModule], // Allows us to use inputs with [(ngModel)]
  templateUrl: './student-registration.component.html',
  styleUrl: './student-registration.component.css',
})
export class StudentRegistration {
  private readonly http = inject(HttpClient); // Injects HTTP client to call C# API
  private readonly router = inject(Router);     // Injects Router to change pages

  // 1. Define variables matching StudentReg.cs fields
  firstName = '';
  lastName = '';
  email = '';
  phoneNumber = '';
  dateOfBirth = '';
  course = '';

  // 2. This method is called when the user clicks "Submit"
  onSubmit() {
    // Construct the payload to match the properties in StudentReg.cs
    const studentData = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phoneNumber: this.phoneNumber,
      dateOfBirth: this.dateOfBirth,
      course: this.course,
    };

    // 3. Make the API POST request to your C# backend
    this.http.post('https://localhost:7069/api/student/StudentInsert', studentData)
      .subscribe({
        next: (response: any) => {
          // If the backend returns success
          if (response && response.status === 'Success') {
            alert('Student added successfully!');
            // Redirect back to the main dashboard table
            this.router.navigate(['/student-dashboard']);
          } else {
            alert('Error adding student: ' + response.message);
          }
        },
        error: (err) => {
          console.error('Error details:', err);
          alert('Failed to connect to the backend server. Make sure your C# API project is running!');
        }
      });
  }

  // Cancel and go back to dashboard without saving
  onCancel() {
    this.router.navigate(['/student-dashboard']);
  }
}