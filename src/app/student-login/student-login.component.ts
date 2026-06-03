import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-login',
  imports: [],
  templateUrl: './student-login.component.html',
  styleUrl: './student-login.component.css',
})
export class StudentLogin {
  private readonly router = inject(Router);

  onLogin(user: string, pass: string) {
    this.router.navigate(['/student-dashboard']);
  }
}