import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { AppModule } from '../app.module';
import { Authority, CompanyDTO, EmployeeDTO, UserDTO } from '../models/users';

describe('UserService', () => {
  let service: UserService;
  let publicUser: UserDTO;
  let EmployeeUser: EmployeeDTO;
  let CompanyUser: CompanyDTO;
  let index: string;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
    });
    service = TestBed.inject(UserService);

    publicUser = {
      FirstName: 'gig',
      LastName: 'ffefe',
      ID: '123',
      Authority: Authority.Public,
      Email: 'test@text.com',
      ProfilePicture: '1231231234',
      PhoneNumber: '1231231234',
      UserName: 'no',
      Notifications: ["",""],
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
      Notifications: ['', ''],
      CompanyName: 'ABC Company',
      PropertyIds: ['123', '123', '123'],
    };

    CompanyUser={
      FirstName: 'gig',
      LastName: 'ffefe',
      ID: '123',
      Authority: Authority.Company,
      Email: 'test@text.com',
      ProfilePicture: '1231231234',
      PhoneNumber: '1231231234',
      UserName: 'no',
      Notifications: ['', ''],
      CompanyName: 'ABC Company',
      PropertyIds: ['123', '123', '123'],
      EmployeeIds: ['123', '123', '123']
    }

    index = '123';
  });

  it('should update the current user', () => {
    // Arrange
    const user = { name: 'John Doe' };

    // Act
    service.updateCurrentUser(user);

    // Assert
    expect((service as any).currentUserSubject.getValue()).toEqual(user);
  });

  it('should check if company exists', async () => {
    // Arrange
    const companyName = 'ABC Company';

    // Act
    const result = await service.checkIfCompanyExists(companyName);

    // Assert
    expect(result).toBe(false);
  });

  it('should get public user', async () => {
 
    await service.editUser(index, publicUser);
    expect(await service.getPublicUser(index)).toEqual(publicUser);
    await service.deleteUser(publicUser);
  });

  it('should get company user', async () => {

    // Act
    await service.editUser(index, CompanyUser);
    expect(await service.getCompanyUser(index)).toEqual(CompanyUser);
    await service.deleteUser(CompanyUser);
  });

  it('should get employee user', async () => {

    // Act
    await service.editUser(index, EmployeeUser);
    expect(await service.getEmployeeUser(index)).toEqual(EmployeeUser);
    await service.deleteUser(EmployeeUser);
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
  
    await service.editUser(index, publicUser);
    await service.deleteUser(publicUser);

    expect(await service.getPublicUser(index)).toBeNull();
  });

  it('should delete company user', async () => {

    // Act
    await service.editUser(index, CompanyUser);
    await service.deleteUser(CompanyUser);

    expect(await service.getCompanyUser(index)).toBeNull();
  });

  it('should delete employee user', async () => {

    // Act
    await service.editUser(index, EmployeeUser);
    await service.deleteUser(EmployeeUser);

    expect(await service.getEmployeeUser(index)).toBeNull();
  });
});
