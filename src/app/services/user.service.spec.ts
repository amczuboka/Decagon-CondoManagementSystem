import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { AppModule } from '../app.module';
import {
  Authority,
  CompanyDTO,
  EmployeeDTO,
  NotificationType,
  Notification,
  RequestStatus,
  Role,
  UserDTO,
} from '../models/users';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';

describe('UserService', () => {
  let service: UserService;
  let publicUser: UserDTO;
  let EmployeeUser: EmployeeDTO;
  let CompanyUser: CompanyDTO;
  let index: string;
  let authService: AuthService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      providers: [UserService, AuthService],
    });
    service = TestBed.inject(UserService);
    (service as any).currentUserSubject = new BehaviorSubject(null);
    authService = TestBed.inject(AuthService);

    publicUser = {
      FirstName: 'gig',
      LastName: 'ffefe',
      ID: '123',
      Authority: Authority.Public,
      Email: 'test@text.com',
      ProfilePicture: '1231231234',
      PhoneNumber: '1231231234',
      UserName: 'no',
    };

    EmployeeUser = {
      FirstName: 'gig',
      LastName: 'ffefe',
      ID: '123',
      Authority: Authority.Employee,
      Email: 'test@text.com',
      ProfilePicture: '1231231234',
      PhoneNumber: '1231231234',
      UserName: 'no',
      CompanyName: 'ABC Company',
      PropertyIds: ['123', '123', '123'],
      Role: Role.Manager,
    };

    CompanyUser = {
      FirstName: 'gig',
      LastName: 'ffefe',
      ID: '123',
      Authority: Authority.Company,
      Email: 'test@text.com',
      ProfilePicture: '1231231234',
      PhoneNumber: '1231231234',
      UserName: 'no',
      CompanyName: 'ABC Company',
      PropertyIds: ['123', '123', '123'],
      EmployeeIds: ['123', '123', '123'],
    };

    index = '123';

    await service.editUser(index, publicUser);
    await service.editUser(index, EmployeeUser);
    await service.editUser(index, CompanyUser);
  });

  afterEach(async () => {
    await service.deleteUser(publicUser);
    await service.deleteUser(EmployeeUser);
    await service.deleteUser(CompanyUser);
  });

  it('should update the current user', () => {
    // Arrange
    const user: UserDTO = {
      FirstName: 'John',
      LastName: 'Doe',
      ID: '123',
      Authority: Authority.Public,
      Email: '',
      ProfilePicture: '',
      PhoneNumber: '',
      UserName: '',
    };

    // Act
    service.updateUser(user);

    // Assert
    expect((service as any).myUserSubject.value).toEqual(user);
  });

  it('should check if company exists', async () => {
    // Arrange
    const companyName = 'ABC Company';
    const NotcompanyName = 'DEF Company';
    // Act
    const result = await service.checkIfCompanyExists(companyName);
    const resultBad = await service.checkIfCompanyExists(NotcompanyName);
    // Assert
    expect(result).toEqual(true);
    expect(resultBad).toEqual(false);
  });

  it('should get public user', async () => {
    expect(await service.getPublicUser(index)).toEqual(publicUser);
  });

  it('should get company user', async () => {
    // Act
    expect(await service.getCompanyUser(index)).toEqual(CompanyUser);
  });

  it('should get employee user', async () => {
    // Act
    expect(await service.getEmployeeUser(index)).toEqual(EmployeeUser);
  });

  it('should edit user', async () => {
    // Arrange
    const index = '123';
    const value = {
      ID: '123',
      Authority: Authority.Public,
      name: 'John Doe',
    };
    // Act
    await service.editUser(index, value);
    await service.deleteUser(value);
  });

  it('should delete public user', async () => {
    await service.deleteUser(publicUser);

    expect(await service.getPublicUser(index)).toBeNull();
  });

  it('should delete company user', async () => {
    // Act
    await service.deleteUser(CompanyUser);

    expect(await service.getCompanyUser(index)).toBeNull();
  });

  it('should delete employee user', async () => {
    // Act
    await service.deleteUser(EmployeeUser);

    expect(await service.getEmployeeUser(index)).toBeNull();
  });

  it('should classify user as public', async () => {
    // Arrange
    spyOn(service, 'getPublicUser').and.returnValue(
      Promise.resolve(publicUser)
    );
    spyOn(service, 'getCompanyUser').and.returnValue(Promise.resolve(null));
    spyOn(service, 'getEmployeeUser').and.returnValue(Promise.resolve(null));

    // Act
    const result = await service.classifyUser(index);

    // Assert
    expect(result).toEqual('public');
  });

  it('should return an array of employees belonging to the specified company', async () => {
    const companyName = 'Company A';

    spyOn(service, 'getEmployeeUser').and.returnValue(
      Promise.resolve(EmployeeUser)
    );

    // Calling the function and expecting a result
    const result = await service.getEmployeesOfCompany(companyName);

    expect(result).toBeTruthy();
    expect(Array.isArray(result)).toBeTrue();
    expect(
      result!.every((employee) => employee.CompanyName === companyName)
    ).toBeTrue();
  });

  it('should update the employee in the database', async () => {
    const employeeToUpdate: EmployeeDTO = {
      ID: 'employee123',
      FirstName: 'John',
      LastName: 'Smith',
      CompanyName: 'Company A',
      Authority: Authority.Employee,
      Email: 'jo@jomama.com',
      ProfilePicture: '',
      PhoneNumber: '1231231234',
      UserName: 'johnsmith',
      PropertyIds: [],
      Notifications: [],
      Role: Role.Manager,
    };

    // Calling the function
    await service.updateEmployee(employeeToUpdate);
    let emp = await service.getEmployeeUser(employeeToUpdate.ID);
    await service.deleteUser(employeeToUpdate);
    expect(emp?.ID).toBe(employeeToUpdate.ID);
  });

  it('should delete the employee from the database', async () => {
    const employeeIdToDelete = 'employee123';

    // Calling the function
    await service.deleteEmployee(employeeIdToDelete);
    let emp = await service.getEmployeeUser(employeeIdToDelete);
    expect(emp).toBeNull();
  });

  it('should register a new public user', async () => {
    let path = 'public users/';
    let userCopy = { ...publicUser };
    userCopy.PhoneNumber = '';
    userCopy.ProfilePicture = '';
    userCopy.UserName = userCopy.FirstName + ' ' + userCopy.LastName;

    await service.registerUser(userCopy, userCopy.ID, path);

    expect(await service.getPublicUser(userCopy.ID)).toEqual(userCopy);
  });

  it('should register a new company', async () => {
    let path = 'companies/';
    let userCopy = { ...CompanyUser } as any;
    userCopy.PhoneNumber = '';
    userCopy.ProfilePicture = '';
    userCopy.UserName = userCopy.FirstName + ' ' + userCopy.LastName;
    delete userCopy.EmployeeIds;
    delete userCopy.PropertyIds;

    await service.registerUser(userCopy, userCopy.ID, path);
    console.log(await service.getCompanyUser(userCopy.ID));
    expect(await service.getCompanyUser(userCopy.ID)).toEqual(userCopy);
  });

  it('should register a new employee', async () => {
    let path = 'employees/';
    let userCopy = { ...EmployeeUser } as any;
    userCopy.PhoneNumber = '';
    userCopy.ProfilePicture = '';
    userCopy.UserName = userCopy.FirstName + ' ' + userCopy.LastName;
    userCopy.Role = Role.None;
    delete userCopy.PropertyIds;

    await service.registerUser(userCopy, userCopy.ID, path);

    expect(await service.getEmployeeUser(userCopy.ID)).toEqual(userCopy);
  });

  it('should send notification to employee of company with financial role', async () => {
    // Arrange
    const companyID = '123';
    const notification: Notification = {
      Message: 'test notification',
      New: true,
      Date: Date.now(),
      SenderId: '123',
      SenderName: 'gig ffefe',
      Type: NotificationType.FinancialRequest,
      Status: RequestStatus.Pending,
    };
    const companyUser: CompanyDTO = {
      FirstName: 'John',
      LastName: 'Doe',
      ID: companyID,
      Authority: Authority.Company,
      Email: 'test@company.com',
      ProfilePicture: '1234567890',
      PhoneNumber: '1234567890',
      UserName: 'company',
      CompanyName: 'ABC Company',
      PropertyIds: ['456', '789'],
      EmployeeIds: ['111', '222'],
    };
    const employee1: EmployeeDTO = {
      FirstName: 'Jane',
      LastName: 'Smith',
      ID: '111',
      Authority: Authority.Employee,
      Email: 'test@employee1.com',
      ProfilePicture: '0987654321',
      PhoneNumber: '9876543210',
      UserName: 'employee1',
      CompanyName: 'ABC Company',
      PropertyIds: ['456'],
      Role: Role.Cleaning,
    };
    const employee2: EmployeeDTO = {
      FirstName: 'Bob',
      LastName: 'Johnson',
      ID: '222',
      Authority: Authority.Employee,
      Email: 'test@employee2.com',
      ProfilePicture: '1357924680',
      PhoneNumber: '0123456789',
      UserName: 'employee2',
      CompanyName: 'ABC Company',
      PropertyIds: ['789'],
      Role: Role.Financial,
    };

    spyOn(service, 'getCompanyUser').and.returnValue(
      Promise.resolve(companyUser)
    );
    spyOn(service, 'getEmployeesOfCompany').and.returnValue(
      Promise.resolve([employee1, employee2])
    );
    spyOn(service, 'sendNotificationToUser');

    // Act
    await service.sendNotificationToEmployeeOfCompany(companyID, notification);

    // Assert
    expect(service.sendNotificationToUser).toHaveBeenCalledTimes(1);
    expect(service.sendNotificationToUser).toHaveBeenCalledWith(
      employee2.ID,
      Authority.Employee,
      notification
    );
  });

  it('should send notification to employee of company with cleaning role', async () => {
    // Arrange
    const companyID = '123';
    const notification: Notification = {
      Message: 'test notification',
      New: true,
      Date: Date.now(),
      SenderId: '123',
      SenderName: 'gig ffefe',
      Type: NotificationType.CleaningRequest,
      Status: RequestStatus.Pending,
    };
    const companyUser: CompanyDTO = {
      FirstName: 'John',
      LastName: 'Doe',
      ID: companyID,
      Authority: Authority.Company,
      Email: 'test@company.com',
      ProfilePicture: '1234567890',
      PhoneNumber: '1234567890',
      UserName: 'company',
      CompanyName: 'ABC Company',
      PropertyIds: ['456', '789'],
      EmployeeIds: ['111', '222'],
    };
    const employee1: EmployeeDTO = {
      FirstName: 'Jane',
      LastName: 'Smith',
      ID: '111',
      Authority: Authority.Employee,
      Email: 'test@employee1.com',
      ProfilePicture: '0987654321',
      PhoneNumber: '9876543210',
      UserName: 'employee1',
      CompanyName: 'ABC Company',
      PropertyIds: ['456'],
      Role: Role.Cleaning,
    };
    const employee2: EmployeeDTO = {
      FirstName: 'Bob',
      LastName: 'Johnson',
      ID: '222',
      Authority: Authority.Employee,
      Email: 'test@employee2.com',
      ProfilePicture: '1357924680',
      PhoneNumber: '0123456789',
      UserName: 'employee2',
      CompanyName: 'ABC Company',
      PropertyIds: ['789'],
      Role: Role.Financial,
    };

    spyOn(service, 'getCompanyUser').and.returnValue(
      Promise.resolve(companyUser)
    );
    spyOn(service, 'getEmployeesOfCompany').and.returnValue(
      Promise.resolve([employee1, employee2])
    );
    spyOn(service, 'sendNotificationToUser');

    // Act
    await service.sendNotificationToEmployeeOfCompany(companyID, notification);

    // Assert
    expect(service.sendNotificationToUser).toHaveBeenCalledTimes(1);
    expect(service.sendNotificationToUser).toHaveBeenCalledWith(
      employee1.ID,
      Authority.Employee,
      notification
    );
  });

  it('should send notification to employee of company with manager role and general message', async () => {
    // Arrange
    const companyID = '123';
    const notification: Notification = {
      Message: 'test notification',
      New: true,
      Date: Date.now(),
      SenderId: '123',
      SenderName: 'gig ffefe',
      Type: NotificationType.GeneralMessage,
      Status: RequestStatus.Pending,
    };
    const companyUser: CompanyDTO = {
      FirstName: 'John',
      LastName: 'Doe',
      ID: companyID,
      Authority: Authority.Company,
      Email: 'test@company.com',
      ProfilePicture: '1234567890',
      PhoneNumber: '1234567890',
      UserName: 'company',
      CompanyName: 'ABC Company',
      PropertyIds: ['456', '789'],
      EmployeeIds: ['111', '222'],
    };
    const employee1: EmployeeDTO = {
      FirstName: 'Jane',
      LastName: 'Smith',
      ID: '111',
      Authority: Authority.Employee,
      Email: 'test@employee1.com',
      ProfilePicture: '0987654321',
      PhoneNumber: '9876543210',
      UserName: 'employee1',
      CompanyName: 'ABC Company',
      PropertyIds: ['456'],
      Role: Role.Manager,
    };
    const employee2: EmployeeDTO = {
      FirstName: 'Bob',
      LastName: 'Johnson',
      ID: '222',
      Authority: Authority.Employee,
      Email: 'test@employee2.com',
      ProfilePicture: '1357924680',
      PhoneNumber: '0123456789',
      UserName: 'employee2',
      CompanyName: 'ABC Company',
      PropertyIds: ['789'],
      Role: Role.Financial,
    };

    spyOn(service, 'getCompanyUser').and.returnValue(
      Promise.resolve(companyUser)
    );
    spyOn(service, 'getEmployeesOfCompany').and.returnValue(
      Promise.resolve([employee1, employee2])
    );
    spyOn(service, 'sendNotificationToUser');

    // Act
    await service.sendNotificationToEmployeeOfCompany(companyID, notification);

    // Assert
    expect(service.sendNotificationToUser).toHaveBeenCalledTimes(1);
    expect(service.sendNotificationToUser).toHaveBeenCalledWith(
      employee1.ID,
      Authority.Employee,
      notification
    );
  });

  it('should send notification to employee of company with maintenance role', async () => {
    // Arrange
    const companyID = '123';
    const notification: Notification = {
      Message: 'test notification',
      New: true,
      Date: Date.now(),
      SenderId: '123',
      SenderName: 'gig ffefe',
      Type: NotificationType.MaintenanceRequest,
      Status: RequestStatus.Pending,
    };
    const companyUser: CompanyDTO = {
      FirstName: 'John',
      LastName: 'Doe',
      ID: companyID,
      Authority: Authority.Company,
      Email: 'test@company.com',
      ProfilePicture: '1234567890',
      PhoneNumber: '1234567890',
      UserName: 'company',
      CompanyName: 'ABC Company',
      PropertyIds: ['456', '789'],
      EmployeeIds: ['111', '222'],
    };
    const employee1: EmployeeDTO = {
      FirstName: 'Jane',
      LastName: 'Smith',
      ID: '111',
      Authority: Authority.Employee,
      Email: 'test@employee1.com',
      ProfilePicture: '0987654321',
      PhoneNumber: '9876543210',
      UserName: 'employee1',
      CompanyName: 'ABC Company',
      PropertyIds: ['456'],
      Role: Role.Maintenance,
    };
    const employee2: EmployeeDTO = {
      FirstName: 'Bob',
      LastName: 'Johnson',
      ID: '222',
      Authority: Authority.Employee,
      Email: 'test@employee2.com',
      ProfilePicture: '1357924680',
      PhoneNumber: '0123456789',
      UserName: 'employee2',
      CompanyName: 'ABC Company',
      PropertyIds: ['789'],
      Role: Role.Financial,
    };

    spyOn(service, 'getCompanyUser').and.returnValue(
      Promise.resolve(companyUser)
    );
    spyOn(service, 'getEmployeesOfCompany').and.returnValue(
      Promise.resolve([employee1, employee2])
    );
    spyOn(service, 'sendNotificationToUser');

    // Act
    await service.sendNotificationToEmployeeOfCompany(companyID, notification);

    // Assert
    expect(service.sendNotificationToUser).toHaveBeenCalledTimes(1);
    expect(service.sendNotificationToUser).toHaveBeenCalledWith(
      employee1.ID,
      Authority.Employee,
      notification
    );
  });

  it('should send notification to employee of company with manager role and ownership request', async () => {
    // Arrange
    const companyID = '123';
    const notification: Notification = {
      Message: 'test notification',
      New: true,
      Date: Date.now(),
      SenderId: '123',
      SenderName: 'gig ffefe',
      Type: NotificationType.OwnershipRequest,
      Status: RequestStatus.Pending,
    };
    const companyUser: CompanyDTO = {
      FirstName: 'John',
      LastName: 'Doe',
      ID: companyID,
      Authority: Authority.Company,
      Email: 'test@company.com',
      ProfilePicture: '1234567890',
      PhoneNumber: '1234567890',
      UserName: 'company',
      CompanyName: 'ABC Company',
      PropertyIds: ['456', '789'],
      EmployeeIds: ['111', '222'],
    };
    const employee1: EmployeeDTO = {
      FirstName: 'Jane',
      LastName: 'Smith',
      ID: '111',
      Authority: Authority.Employee,
      Email: 'test@employee1.com',
      ProfilePicture: '0987654321',
      PhoneNumber: '9876543210',
      UserName: 'employee1',
      CompanyName: 'ABC Company',
      PropertyIds: ['456'],
      Role: Role.Manager,
    };
    const employee2: EmployeeDTO = {
      FirstName: 'Bob',
      LastName: 'Johnson',
      ID: '222',
      Authority: Authority.Employee,
      Email: 'test@employee2.com',
      ProfilePicture: '1357924680',
      PhoneNumber: '0123456789',
      UserName: 'employee2',
      CompanyName: 'ABC Company',
      PropertyIds: ['789'],
      Role: Role.Financial,
    };

    spyOn(service, 'getCompanyUser').and.returnValue(
      Promise.resolve(companyUser)
    );
    spyOn(service, 'getEmployeesOfCompany').and.returnValue(
      Promise.resolve([employee1, employee2])
    );
    spyOn(service, 'sendNotificationToUser');

    // Act
    await service.sendNotificationToEmployeeOfCompany(companyID, notification);

    // Assert
    expect(service.sendNotificationToUser).toHaveBeenCalledTimes(1);
    expect(service.sendNotificationToUser).toHaveBeenCalledWith(
      employee1.ID,
      Authority.Employee,
      notification
    );
  });

  it('should send notification to employee of company with manager role and rent request', async () => {
    // Arrange
    const companyID = '123';
    const notification: Notification = {
      Message: 'test notification',
      New: true,
      Date: Date.now(),
      SenderId: '123',
      SenderName: 'gig ffefe',
      Type: NotificationType.RentRequest,
      Status: RequestStatus.Pending,
    };
    const companyUser: CompanyDTO = {
      FirstName: 'John',
      LastName: 'Doe',
      ID: companyID,
      Authority: Authority.Company,
      Email: 'test@company.com',
      ProfilePicture: '1234567890',
      PhoneNumber: '1234567890',
      UserName: 'company',
      CompanyName: 'ABC Company',
      PropertyIds: ['456', '789'],
      EmployeeIds: ['111', '222'],
    };
    const employee1: EmployeeDTO = {
      FirstName: 'Jane',
      LastName: 'Smith',
      ID: '111',
      Authority: Authority.Employee,
      Email: 'test@employee1.com',
      ProfilePicture: '0987654321',
      PhoneNumber: '9876543210',
      UserName: 'employee1',
      CompanyName: 'ABC Company',
      PropertyIds: ['456'],
      Role: Role.Manager,
    };
    const employee2: EmployeeDTO = {
      FirstName: 'Bob',
      LastName: 'Johnson',
      ID: '222',
      Authority: Authority.Employee,
      Email: 'test@employee2.com',
      ProfilePicture: '1357924680',
      PhoneNumber: '0123456789',
      UserName: 'employee2',
      CompanyName: 'ABC Company',
      PropertyIds: ['789'],
      Role: Role.Financial,
    };

    spyOn(service, 'getCompanyUser').and.returnValue(
      Promise.resolve(companyUser)
    );
    spyOn(service, 'getEmployeesOfCompany').and.returnValue(
      Promise.resolve([employee1, employee2])
    );
    spyOn(service, 'sendNotificationToUser');

    // Act
    await service.sendNotificationToEmployeeOfCompany(companyID, notification);

    // Assert
    expect(service.sendNotificationToUser).toHaveBeenCalledTimes(1);
    expect(service.sendNotificationToUser).toHaveBeenCalledWith(
      employee1.ID,
      Authority.Employee,
      notification
    );
  });

  it('should send notification to employee of company with security role', async () => {
    // Arrange
    const companyID = '123';
    const notification: Notification = {
      Message: 'test notification',
      New: true,
      Date: Date.now(),
      SenderId: '123',
      SenderName: 'gig ffefe',
      Type: NotificationType.SecurityRequest,
      Status: RequestStatus.Pending,
    };
    const companyUser: CompanyDTO = {
      FirstName: 'John',
      LastName: 'Doe',
      ID: companyID,
      Authority: Authority.Company,
      Email: 'test@company.com',
      ProfilePicture: '1234567890',
      PhoneNumber: '1234567890',
      UserName: 'company',
      CompanyName: 'ABC Company',
      PropertyIds: ['456', '789'],
      EmployeeIds: ['111', '222'],
    };
    const employee1: EmployeeDTO = {
      FirstName: 'Jane',
      LastName: 'Smith',
      ID: '111',
      Authority: Authority.Employee,
      Email: 'test@employee1.com',
      ProfilePicture: '0987654321',
      PhoneNumber: '9876543210',
      UserName: 'employee1',
      CompanyName: 'ABC Company',
      PropertyIds: ['456'],
      Role: Role.Security,
    };
    const employee2: EmployeeDTO = {
      FirstName: 'Bob',
      LastName: 'Johnson',
      ID: '222',
      Authority: Authority.Employee,
      Email: 'test@employee2.com',
      ProfilePicture: '1357924680',
      PhoneNumber: '0123456789',
      UserName: 'employee2',
      CompanyName: 'ABC Company',
      PropertyIds: ['789'],
      Role: Role.Financial,
    };

    spyOn(service, 'getCompanyUser').and.returnValue(
      Promise.resolve(companyUser)
    );
    spyOn(service, 'getEmployeesOfCompany').and.returnValue(
      Promise.resolve([employee1, employee2])
    );
    spyOn(service, 'sendNotificationToUser');

    // Act
    await service.sendNotificationToEmployeeOfCompany(companyID, notification);

    // Assert
    expect(service.sendNotificationToUser).toHaveBeenCalledTimes(1);
    expect(service.sendNotificationToUser).toHaveBeenCalledWith(
      employee1.ID,
      Authority.Employee,
      notification
    );
  });

  it('should send notification to company since it has no employees with that role', async () => {
    // Arrange
    const companyID = '123';
    const notification: Notification = {
      Message: 'test notification',
      New: true,
      Date: Date.now(),
      SenderId: '123',
      SenderName: 'gig ffefe',
      Type: NotificationType.SecurityRequest,
      Status: RequestStatus.Pending,
    };
    const companyUser: CompanyDTO = {
      FirstName: 'John',
      LastName: 'Doe',
      ID: companyID,
      Authority: Authority.Company,
      Email: 'test@company.com',
      ProfilePicture: '1234567890',
      PhoneNumber: '1234567890',
      UserName: 'company',
      CompanyName: 'ABC Company',
      PropertyIds: ['456', '789'],
      EmployeeIds: [],
    };

    spyOn(service, 'getCompanyUser').and.returnValue(
      Promise.resolve(companyUser)
    );
    spyOn(service, 'getEmployeesOfCompany').and.returnValue(
      Promise.resolve([])
    );
    spyOn(service, 'sendNotificationToUser');

    // Act
    await service.sendNotificationToEmployeeOfCompany(companyID, notification);

    // Assert
    expect(service.sendNotificationToUser).toHaveBeenCalledTimes(1);
    expect(service.sendNotificationToUser).toHaveBeenCalledWith(
      companyID,
      Authority.Company,
      notification
    );
  });
});
