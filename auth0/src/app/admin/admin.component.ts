import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';

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
  private editEmployeeForm        : FormGroup;
	private employees			  	      : Array<Employee>;
	private serverValidationErrors  : Array<any> = [];
	private successMessage          : string;
  private errorMessage            : string;
  private employeeToEdit          : Employee;


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
      //   let name         = this.employeeToEdit ? this.employeeToEdit.name : null; 
      //   let position     = this.employeeToEdit ? this.employeeToEdit.position : null;
      //   let about        = this.employeeToEdit ? this.employeeToEdit.about : null;
      //   let linkedInAcc  = this.employeeToEdit ? this.employeeToEdit.linkedInAcc : null;

        this.editEmployeeForm = fb.group({
          'name': [ null, Validators.compose([ Validators.required, Validators.minLength(3) ])],
          'position': [ null, Validators.compose([  Validators.minLength(3) ])],
          'about': [ null, Validators.compose([  Validators.minLength(2) ])],
          'linkedInAcc': [ null ]
      });

  	}

  	ngOnInit() {
      this.getEmployees();
      
  	}

    ngAfterViewInit() {
      
    }

  	toggleAddEmployeeForm() {
  		this.displayAddEmployeeForm = !this.displayAddEmployeeForm;
  	}

  	addEmployee( employee ) {
      	let files = this.element.nativeElement.querySelector('#profileImage').files;
      	let file = files[0];

      	console.log('FILE: ', file);

      	let formData = new FormData(employee);

      	formData.append('profileImage', file, file.name);

      	Object.keys(employee).forEach((item) => {
        	formData.append(item, employee[item]);
      	});
      	// console.log(formData.get('profileImage'))

      	this.employeesService.addEmployee(formData)
      		.subscribe( ( res:any ) => {

      			if ( res.success === true) {
    					this.successMessage = res.msg;
    					this.serverValidationErrors = [];
    					this.addEmployeeForm.reset();
    					this.toggleAddEmployeeForm();
              this.getEmployees();
    				}
      		})
  	}

    getEmployees (): any {
      this.employeesService.getEmployees()
        .subscribe( ( res ) => {
          if( res.success === true ) {
            this.employees = res.employees;
          }
          else if ( res.errors ) {
            res.errors.forEach((err) => {
              this.serverValidationErrors.push(err);
            })
          }
          else {
            this.errorMessage = res.msg;
          }
        })
    }

    getEmployeeById ( id ) {
      this.employeesService.getEmployeeById(id)
         .subscribe( ( res ) => {
           if ( res.success === true ) {
             console.log(res);
             this.employeeToEdit = res.employee[0];
           }
           else {
             this.errorMessage = res.msg;
           }
         })
    }

    displayEditEmployeeForm ( employeeId ) {
      console.log(employeeId )
      this.getEmployeeById(employeeId );

      let modal = document.getElementById('myModal');
      console.log(modal)
    }

    editEmployee ( employee ) {
      console.log(employee)

      let form = document.querySelector('form');
      console.log(form)
    }

    deleteEmployee ( id ) {

      if ( confirm('Are you sure?') ) {
        this.employeesService.removeEmployee(id)
          .subscribe( (res) => {
            
            if ( res.success === true ) {
              
              this.successMessage = `${res.msg} : ${res.employee.name}`;
              
              for ( let i = 0; i < this.employees.length; i++ ) {
                
                let employee = this.employees[i];
                
                if(employee._id == id) {
                  this.employees.splice(i, 1);
                  return;
                }
              }
            }
            else {
              this.serverValidationErrors = [res.msg];
            }
          })
      }
    }

     onSubmit(editForm: NgForm) {
    console.log(editForm.value);  // { first: '', last: '' }
    console.log(editForm.valid);  // false
  }

}
