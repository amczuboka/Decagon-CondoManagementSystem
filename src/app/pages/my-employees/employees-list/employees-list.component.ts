import { Component, ViewChild } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table';
import {
  Authority,
  CompanyDTO,
  EmployeeDTO,
  Role,
  User,
} from 'src/app/models/users';
import { AuthService } from 'src/app/services/auth.service';
import { BuildingService } from 'src/app/services/building.service';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.scss'],
})
export class EmployeesListComponent {
  @ViewChild(MatTable) table!: MatTable<any>;

  columnsToDisplay = ['name', 'email', 'properties', 'role'];

  employeesTable: any[] = [];
  employees: EmployeeDTO[] = [];

  roles: string[] = [];

  properties: any[] = [];

  myUser!: any;
  authority!: string;

  constructor(
    private _snackBar: MatSnackBar,
    private userService: UserService,
    private buildingService: BuildingService,
    private authService: AuthService,
    public notificationService: NotificationService
  ) {
    this.roles = Object.keys(Role);
  }

  async ngOnInit() {
    // Fetch the current user
    try {
      this.myUser = await this.authService.getUser();
      if (this.myUser) {
        this.authority = this.myUser.photoURL;
      }
      if (this.authority == Authority.Company) {
        this.userService.getCompanyUser(this.myUser.uid).then((user) => {
          this.myUser = user;
        });
      }
    } catch (error) {
      console.error(error);
      this.authority = '';
    }
    this.myUser = (await this.userService.getCompanyUser(
      ((await this.authService.getUser()) as User)?.uid
    )) as CompanyDTO;
    this.employees = (await this.userService.getEmployeesOfCompany(
      this.myUser.CompanyName
    )) as EmployeeDTO[];
    await this.setProperties();
    this.setEmployeesTable();
  }

  private setEmployeesTable() {
    this.employees.forEach((emp) => {
      let buildings: string[] = [];
      emp.PropertyIds?.forEach(async (id) => {
        try {
          buildings.push((await this.buildingService.getBuilding(id)).Name);
        } catch (error) {
          console.log(error);
        }
      });
      this.employeesTable.push({
        id: emp.ID,
        name: emp.FirstName + ' ' + emp.LastName,
        email: emp.Email,
        properties: buildings,
        role: emp.Role,
        picture: emp.ProfilePicture,
      });
    });
    this.table.renderRows();
  }

  private async setProperties() {
    const buildings = await this.buildingService.getAllBuildingsOfCompany(
      this.myUser.ID
    );
    buildings.forEach((building) => {
      this.properties.push({ id: building.ID, name: building.Name });
    });
  }

  checkAll(checkbox: MatCheckbox) {
    this.employeesTable.forEach((x) => (x.checked = checkbox.checked));
  }

  isAllChecked() {
    return this.employeesTable.every((_) => _.checked);
  }

  isSomeItemsChecked() {
    return this.employeesTable.some((_) => _.checked);
  }

  removeSelectedItems() {
    const selectedEmployees = this.employeesTable
      .filter((x) => x.checked)
      .map((x) => x.id);
    this.employeesTable = this.employeesTable.filter((x) => !x.checked);
    selectedEmployees.forEach((emp) => {
      this.userService.deleteEmployee(emp);
    });
    this.openSnackBar('Employees Deleted');
  }

  update() {
    this.employeesTable.forEach((emp) => {
      let employee = this.employees.find((x) => x.ID == emp.id);
      if (employee) {
        employee.PropertyIds = this.getBuildingIds(emp);
        employee.Role = emp.role;
        this.userService.updateEmployee(employee);
      }
    });
    this.openSnackBar('Employees Updated');
  }

  private getBuildingIds(emp: any): string[] {
    let propertyIds: string[] = [];
    emp.properties?.forEach(async (prop: string) => {
      let building = this.properties.find((x) => x.name == prop);
      propertyIds?.push(building.id);
    });
    return propertyIds;
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, '', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
