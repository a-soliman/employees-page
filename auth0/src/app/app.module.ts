import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { ROUTES } from './app.routes';

import { AuthService } from './auth/auth.service';
import { CallbackComponent } from './callback/callback.component';
import { AdminComponent } from './admin/admin.component';
import { EmployeesComponent } from './employees/employees.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CallbackComponent,
    AdminComponent,
    EmployeesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES)
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
