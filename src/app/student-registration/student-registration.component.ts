import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-student-registration',
  imports: [FormsModule],
  templateUrl: './student-registration.component.html',
  styleUrl: './student-registration.component.css',
})
export class StudentRegistration implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute); // Injects route tracker to check URL parameters
  private readonly cdr = inject(ChangeDetectorRef);

  // Form properties
  firstName = '';
  lastName = '';
  email = '';
  phoneNumber = '';
  dateOfBirth = '';
  course = '';

  // Edit Mode variables
  isEditMode = false;
  studentId: number | null = null;

  ngOnInit() {
    // 1. Check if an '?id=...' parameter exists in the URL
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isEditMode = true;
        this.studentId = Number(id);
        this.loadStudentDetails(this.studentId); // Fetch student details to pre-fill form
      }
    });
  }

  // 2. Load existing student details from backend API
  loadStudentDetails(id: number) {
    this.http.get<any>(`https://localhost:7069/api/student/GetStudent/${id}`)
      .subscribe({
        next: (data) => {
          if (data && data.status === 'Success' && data.response) {
            const student = data.response;
            this.firstName = student.firstName;
            this.lastName = student.lastName;
            this.email = student.email;
            this.phoneNumber = student.phoneNumber;
            
            // Format the date (YYYY-MM-DD) so the calendar input displays it correctly
            if (student.dateOfBirth) {
              this.dateOfBirth = student.dateOfBirth.split('T')[0];
            }
            
            this.course = student.course || '';

            this.cdr.detectChanges();
          } else {
            alert('Failed to load student details: ' + data.message);
          }
        },
        error: (err) => {
          console.error(err);
          alert('Could not fetch student details for editing.');
        }
      });
  }

  onSubmit() {
    // Construct the payload structure matching StudentReg.cs
    const studentData: any = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phoneNumber: this.phoneNumber,
      dateOfBirth: this.dateOfBirth,
      course: this.course,
    };

    // 3. Choose between Update (PUT) or Insert (POST)
    if (this.isEditMode && this.studentId !== null) {
      studentData.id = this.studentId; // C# Update API needs the student ID in the body
      
      this.http.put('https://localhost:7069/api/student/StudentUpdate', studentData)
        .subscribe({
          next: (response: any) => {
            if (response && response.status === 'Success') {
              alert('Student updated successfully!');
              this.router.navigate(['/student-dashboard']);
            } else {
              alert('Error updating student: ' + response.message);
            }
          },
          error: (err) => {
            console.error('Update error:', err);
            alert('Failed to update student details.');
          }
        });
    } else {
      this.http.post('https://localhost:7069/api/student/StudentInsert', studentData)
        .subscribe({
          next: (response: any) => {
            if (response && response.status === 'Success') {
              alert('Student added successfully!');
              this.router.navigate(['/student-dashboard']);
            } else {
              alert('Error adding student: ' + response.message);
            }
          },
          error: (err) => {
            console.error('Insert error:', err);
            alert('Failed to add new student.');
          }
        });
    }
  }

  onCancel() {
    this.router.navigate(['/student-dashboard']);
  }
}