import { Component, OnInit, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AuthService } from '../auth/auth.service';
import { EmployeesService } from '../services/employees.service';
import { Employee } from '../employee';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  providers: [ EmployeesService ]
})
export class AdminComponent implements OnInit {
	private displayAddEmployeeForm	: boolean = false;
	private addEmployeeForm       	: FormGroup;
	private employees			  	: Array<Employee>;
	private serverValidationErrors  : Array<any> = [];
	private successMessage          : string;


  	constructor(public auth: AuthService,
  				private fb: FormBuilder,
  				private employeesService: EmployeesService,
           		private element: ElementRef ) {

  		this.addEmployeeForm = fb.group({
  			'name': [null, Validators.compose([ Validators.required, Validators.minLength(3) ])],
  			'position': [null, Validators.compose([ Validators.required, Validators.minLength(3) ])],
  			'about': [ null, Validators.compose([ Validators.required, Validators.minLength(2) ])],
  			'linkedInAcc': [ null ]
  		});

  	}

  	ngOnInit() {
  	}

  	toggleAddEmployeeForm() {
  		this.displayAddEmployeeForm = !this.displayAddEmployeeForm;
  	}

  	addEmployee( employee ) {
  		console.log(employee);
  		//image handeling
      	let files = this.element.nativeElement.querySelector('#profileImage').files;
      	let file = files[0];

      	console.log('FILE: ', file);

      	let formData = new FormData(employee);

      	formData.append('profileImage', file, file.name)

      	Object.keys(employee).forEach((item) => {
        	formData.append(item, employee[item]);
      	});
      	// console.log(formData.get('profileImage'))

      	this.employeesService.addEmployee(formData)
      		.subscribe( ( res:any ) => {
      			console.log('RES: ', res);

      			if ( res.success === true) {
					this.successMessage = res.msg;
					this.serverValidationErrors = [];
					this.addEmployeeForm.reset();
					this.toggleAddEmployeeForm();
				  }
      		})
  	}

}