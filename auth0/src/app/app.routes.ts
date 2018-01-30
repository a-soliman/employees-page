import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CallbackComponent } from './callback/callback.component';
import { AdminComponent } from './admin/admin.component';
import { EmployeesComponent } from './employees/employees.component';
import { EmployeeComponent } from './employee/employee.component';

export const ROUTES: Routes = [
  { path: 'employees/:id', component: EmployeeComponent },
  { path: '', component: EmployeesComponent },
  { path: 'callback', component: CallbackComponent },
  { path: 'admin', component: AdminComponent },
  { path: '**', redirectTo: '' }
];
