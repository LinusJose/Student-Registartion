import { Component } from '@angular/core';

@Component({
  selector: 'app-student-login',
  imports: [],
  templateUrl: './student-login.component.html',
  styleUrl: './student-login.component.css',
})
export class StudentLogin {
  // This function takes the username and password values from HTML and alerts them
  onLogin(user: string, pass: string) {
    alert(`Logged in with:\nUsername: ${user}\nPassword: ${pass}`);
  }
}