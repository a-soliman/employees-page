import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { EmployeesService } from '../services/employees.service'
import { Employee } from '../employee';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  providers: [ EmployeesService ]
})
export class EmployeeComponent implements OnInit {
	public id: string;
	public employee: Employee;
	public errorMessage: string;
  
  constructor(private activatedRoute: ActivatedRoute,
  			  private employeesService: EmployeesService ) { 

  	this.activatedRoute.params.subscribe(params => {
        this.id =  params.id;
    });
  }

  ngOnInit() {
  	this.getEmployeeById(this.id);
  }

  getEmployeeById ( id ) {
  	this.employeesService.getEmployeeById(id)
  		.subscribe((res) => {
  			if ( res.success === true ) {
	  				this.employee = res.employee[0];
	  		}
	  		else if (res.success === false ) {
	  			this.errorMessage = res.msg;
	  		}
  			else {
  				this.errorMessage = JSON.parse(res._body).msg;
  				console.log(this.errorMessage)
  			}
  		})
  }

}
