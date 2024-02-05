import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { AppModule } from '../app.module';
import { Authority } from '../models/users';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
    });
    service = TestBed.inject(UserService);
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
    // Arrange
    const userId = '123';

    // Act
    const result = await service.getPublicUser(userId);

    // Assert
    expect(result).toBeNull();
  });

  it('should get company user', async () => {
    // Arrange
    const userId = '456';

    // Act
    const result = await service.getCompanyUser(userId);

    // Assert
    expect(result).toBeNull();
  });

  it('should get employee user', async () => {
    // Arrange
    const userId = '789';

    // Act
    const result = await service.getEmployeeUser(userId);

    // Assert
    expect(result).toBeNull();
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
});
