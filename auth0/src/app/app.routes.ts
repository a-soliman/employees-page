import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CallbackComponent } from './callback/callback.component';
import { AdminComponent } from './admin/admin.component';
import { EmployeesComponent } from './employees/employees.component';

export const ROUTES: Routes = [
  { path: '', component: EmployeesComponent },
  { path: 'callback', component: CallbackComponent },
  { path: 'admin', component: AdminComponent },
  { path: '**', redirectTo: '' }
];
