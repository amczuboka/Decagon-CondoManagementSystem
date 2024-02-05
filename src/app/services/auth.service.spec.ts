import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { AppModule } from '../app.module';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUser', () => {
    it('should return the user from localStorage', () => {
      // Arrange
      const user = { name: 'John Doe', email: 'john@example.com' };
      localStorage.setItem('user', JSON.stringify(user));

      // Act
      const result = service.getUser();

      // Assert
      expect(result).toEqual(user);
    });

    it('should return null if user is not found in localStorage', () => {
      // Arrange
      localStorage.removeItem('user');

      // Act
      const result = service.getUser();

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('isLoggedIn', () => {
    it('should return true if user is logged in', () => {
      // Arrange
      const user = { name: 'John Doe', email: 'john@example.com' };
      localStorage.setItem('user', JSON.stringify(user));

      // Act
      const result = service.isLoggedIn;

      // Assert
      expect(result).toBe(true);
    });

    it('should return false if user is not logged in', () => {
      // Arrange
      localStorage.removeItem('user');

      // Act
      const result = service.isLoggedIn;

      // Assert
      expect(result).toBe(false);
    });
  });
});
