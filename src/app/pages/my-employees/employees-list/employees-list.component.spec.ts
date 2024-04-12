import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AppModule } from 'src/app/app.module';

import { EmployeesListComponent } from './employees-list.component';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { Authority, CompanyDTO, EmployeeDTO, Role, User } from 'src/app/models/users';

describe('EmployeesListComponent', () => {
  let component: EmployeesListComponent;
  let fixture: ComponentFixture<EmployeesListComponent>;
  let userService: UserService;
  let authService: AuthService;

  beforeEach(() => {
    // Create spy objects for UserService and AuthService
    TestBed.configureTestingModule({
      imports: [AppModule, MatSnackBarModule],
      declarations: [EmployeesListComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(EmployeesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    userService = TestBed.inject(UserService);
    authService = TestBed.inject(AuthService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set myUser and employees properties and call setProperties and setEmployeesTable', async () => {
    // Mock user data and employee data
    // Mock user data
    const mockUser: User = {
      uid: 'userId123',
      email: 'user@example.com',
      photoURL: 'https://example.com/photo.jpg',
      emailVerified: true
    };

    const mockCompany: CompanyDTO = {
      FirstName: 'John',
      LastName: 'Doe',
      ID: 'companyId123',
      Authority: Authority.Company,
      Email: 'john.doe@example.com',
      ProfilePicture: 'profile-picture-url',
      PhoneNumber: '123456789',
      UserName: 'johndoe',
      CompanyName: 'Company A',
      PropertyIds: ['propertyId1', 'propertyId2'],
      EmployeeIds: ['employeeId1', 'employeeId2']
    };
    const mockEmployees: EmployeeDTO[] = [
      {
        FirstName: 'John',
        LastName: 'Doe',
        ID: 'employeeId1',
        Authority: Authority.Employee,
        Email: 'john.doe@example.com',
        ProfilePicture: 'profile-picture-url',
        CompanyName: 'Company A',
        PhoneNumber: '123456789',
        UserName: 'johndoe',
        PropertyIds: ['propertyId1', 'propertyId2'],
        Role: Role.None
      },
      {
        FirstName: 'Jane',
        LastName: 'Smith',
        ID: 'employeeId2',
        Authority: Authority.Employee,
        Email: 'jane.smith@example.com',
        ProfilePicture: 'profile-picture-url',
        CompanyName: 'Company A',
        PhoneNumber: '987654321',
        UserName: 'janesmith',
        PropertyIds: ['propertyId3', 'propertyId4'],
        Role: Role.None
      }
    ];

    // Mock the return values for authService.getUser and userService.getCompanyUser
    spyOn(authService, 'getUser').and.returnValue(Promise.resolve(mockUser));
    spyOn(userService, 'getCompanyUser').and.returnValue(Promise.resolve(mockCompany));
    spyOn(userService, 'getEmployeesOfCompany').and.returnValue(Promise.resolve(mockEmployees));

    // Call ngOnInit
    await component.ngOnInit();

    // Expectations
    expect(authService.getUser).toHaveBeenCalled();
    expect(userService.getCompanyUser).toHaveBeenCalledWith(mockUser.uid);
    expect(userService.getEmployeesOfCompany).toHaveBeenCalledWith(mockCompany.CompanyName);
    expect(component.myUser).toEqual(mockCompany);
    expect(component.employees).toEqual(mockEmployees);
    expect(component.myUser).toEqual(mockCompany);
    expect(component.employees).toEqual(mockEmployees);
  });

  it('should check all', () => {
    component.checkAll({ checked: true } as any);
    expect(component.employeesTable.every(x => x.checked)).toBeTrue();
  });

  it('should uncheck all', () => {
    component.checkAll({ checked: false } as any);
    expect(component.employeesTable.every(x => !x.checked)).toBeTrue();
  });

  it('should check if all checked', () => {
    component.employeesTable = [{ checked: true }, { checked: true }];
    expect(component.isAllChecked()).toBeTrue();
  });

  it('should check if some items checked', () => {
    component.employeesTable = [{ checked: true }, { checked: false }];
    expect(component.isSomeItemsChecked()).toBeTrue();
  });

  it('should remove selected items and delete corresponding employees', () => {
    // Mock employees table with checked employees
    component.employeesTable = [
      { id: '1', checked: true },
      { id: '2', checked: false },
      { id: '3', checked: true }
    ];
    spyOn(userService, 'deleteEmployee').and.returnValue(Promise.resolve());

    // Call removeSelectedItems method
    component.removeSelectedItems();

    // Expectations
    expect(component.employeesTable.length).toBe(1); // Only unchecked employees should remain
    expect(userService.deleteEmployee).toHaveBeenCalledTimes(2); // Two employees were checked
  });

  it('should update employees and call updateEmployee for each employee in employeesTable', () => {
    // Mock properties, employees and employeesTable
    component.properties = [
      { id: 'buildingId1', name: 'Building 1' },
      { id: 'buildingId2', name: 'Building 2' }
    ];
    component.employees = [
      {
        FirstName: 'John',
        LastName: 'Doe',
        ID: '1',
        Authority: Authority.Employee,
        Email: 'john.doe@example.com',
        ProfilePicture: 'profile-picture-url',
        CompanyName: 'Company A',
        PhoneNumber: '123456789',
        UserName: 'johndoe',
        PropertyIds: ['buildingId1'],
        Role: Role.Cleaning
      },
      {
        FirstName: 'Jane',
        LastName: 'Smith',
        ID: '2',
        Authority: Authority.Employee,
        Email: 'jane.smith@example.com',
        ProfilePicture: 'profile-picture-url',
        CompanyName: 'Company A',
        PhoneNumber: '987654321',
        UserName: 'janesmith',
        PropertyIds: ['buildingId2'],
        Role: Role.Manager
      }
    ];
    component.employeesTable = [
      { id: '1', properties: ['Building 1'], role: 'Cleaning' },
      { id: '2', properties: ['Building 2'], role: 'Manager' }
    ];
    
    spyOn(userService, 'updateEmployee').and.returnValue(Promise.resolve());

    // Call update method
    component.update();

    // Expectations
    expect(userService.updateEmployee).toHaveBeenCalledTimes(2);
    expect(component.employees[0].Role).toBe(Role.Cleaning);
    expect(component.employees[0].PropertyIds).toEqual(component['getBuildingIds'](component.employeesTable[0]));
    expect(component.employees[1].Role).toBe(Role.Manager);
    expect(component.employees[1].PropertyIds).toEqual(component['getBuildingIds'](component.employeesTable[1]));
  });
});
