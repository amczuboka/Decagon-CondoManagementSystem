import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { Role } from 'src/app/models/users';

@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.scss']
})
export class EmployeesListComponent {
  columnsToDisplay = ['name', 'email', 'properties', 'role'];
  
  employees: any[] = [
    { "id": 0, "name": "John Doe", "email": "nick.pip@yahoo.com", "properties": ["Building-1", "Building-2", "Building-3"], "role": "Manager"},
    { "id": 1, "name": "Jane Doe", "email": "nick.pip@yahoo.com", "properties": ["Building-1", "Building-2"], "role": "Cleaning"},
    { "id": 2, "name": "Jim Doe", "email": "nick.pip@yahoo.com", "properties": ["Building-1", "Building-2"], "role": "Security"},
  ];

  
  roles = [] as string[];
  
  propertiesList = [
    'Building-0',
    'Building-1',
    'Building-2',
    'Building-3',
    'Building-4',
    'Building-5'
  ];

  constructor() { 
    this.roles = Object.keys(Role);
    console.log(this.employees[0].properties);
  }

  checkAll(checkbox: MatCheckbox) {
    this.employees.forEach(x => x.checked = checkbox.checked);
    console.log(checkbox.checked);
    console.log(this.employees);
  }

  isAllChecked() {
    return this.employees.every(_ => _.checked);
  }

  isSomeItemsChecked() {
    return this.employees.some(_ => _.checked);
  }

  remeveSelectedItems() {
    this.employees = this.employees.filter(x => !x.checked);
  }

  update() {
    console.log(this.employees);
  }
}
