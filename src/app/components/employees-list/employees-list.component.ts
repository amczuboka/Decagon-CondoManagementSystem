import { Component } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
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

  constructor(private _snackBar: MatSnackBar) { 
    this.roles = Object.keys(Role);
  }

  checkAll(checkbox: MatCheckbox) {
    this.employees.forEach(x => x.checked = checkbox.checked);
  }

  isAllChecked() {
    return this.employees.every(_ => _.checked);
  }

  isSomeItemsChecked() {
    return this.employees.some(_ => _.checked);
  }

  removeSelectedItems() {
    this.employees = this.employees.filter(x => !x.checked);
    // To do: Update DB
    console.log(this.employees);
    this.openSnackBar("Employees Removed");
  }

  update() {
    console.log(this.employees);
    // To do: Update DB
    this.openSnackBar("Employees Updated");
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, '', {
       duration: 30000, 
       horizontalPosition: 'center',
       verticalPosition: 'top',
      });
  }
}
