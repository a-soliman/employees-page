import { Injectable } from '@angular/core';
import { Http, Headers, Response, ResponseOptions } from '@angular/http';

import 'rxjs/add/operator/map';

@Injectable()
export class EmployeesService {

  constructor( private http: Http ) { }

  	getEmployees() {
  		return this.http.get("http://localhost:3000/employee")
  			.map( res => res.json() );
  	}

    addEmployee( employee ) {
      console.log('Service recived: ', employee);
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      //headers.append('Content-Type', 'image/jpeg');

      return this.http.post("http://localhost:3000/employee/add", employee)
        .map( res => res.json() );
    }

  	getEmployeeById( id ) {
      return this.http.get(`http://localhost:3000/employee/${id}`)
        .map( res => res.json() );
  	}

  	removeEmployee( id ) {
      return this.http.delete(`http://localhost:3000/employee/${id}`)
        .map( res => res.json());
  	}

  	updateEmployee( employee ) {

  	}

}
