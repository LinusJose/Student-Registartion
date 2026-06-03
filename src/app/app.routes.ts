import { Routes } from '@angular/router';
import { StudentLogin } from './student-login/student-login.component';
import { StudentDashboard } from './student-dashboard/student-dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: 'student-login', pathMatch: 'full' },
  { path: 'student-login', component: StudentLogin },
  { path: 'student-dashboard', component: StudentDashboard }
];
