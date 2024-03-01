import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { AppModule } from '../app.module';
import {
  Authority,
  CompanyDTO,
  EmployeeDTO,
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
});
