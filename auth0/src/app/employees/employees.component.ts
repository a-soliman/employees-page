import { Component, OnInit } from '@angular/core';

import { EmployeesService } from '../services/employees.service';
import { Employee } from '../employee';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css'],
  providers: [ EmployeesService ]
})
export class EmployeesComponent implements OnInit {

	public employees: Array<Employee>;
	public errorMessage: string;


	constructor( private employeesService: EmployeesService ) { }

	ngOnInit() {
		this.getEmployees()
	}

	getEmployees() {
	  	this.employeesService.getEmployees()
	  		.subscribe( ( res ) => {

	  			if( res.success === true ) {
	  				this.employees = res.employees;
	  			}
	  			else {
	  				this.errorMessage = res.msg;
	  			}
	  		})
	}

}
