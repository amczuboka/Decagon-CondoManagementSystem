import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { AppModule } from '../app.module';
import { Authority } from '../models/users';

describe('AuthService', () => {
  let service: AuthService;
  let email = 'dojefe6817@giratex.com';
  let password = '123456';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
    });
    service = TestBed.inject(AuthService);
  });

  afterEach(async () => {
    await service.SignOut();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  describe('SignIn', () => {
    it('should sign in the user', async () => {
      const spySetUserData = spyOn(service, 'SetUserData');

      await service.SignIn(email, password);

      expect(spySetUserData).toHaveBeenCalled();
    });

    it('should send alert when there is an error with code auth/invalid-credential', async () => {
      spyOn(service.afAuth, 'signInWithEmailAndPassword').and.returnValue(
        Promise.reject({ code: 'auth/invalid-credential' })
      );
      const spy = spyOn(service.notificationService, 'sendAlert');

      try {
        await service.SignIn('test@example.com', 'password');
      } catch (error) {
        expect(spy).toHaveBeenCalledWith('Error: Invalid credentials');
      }
    });

    it('should send notification when user email is not verified', async () => {
      const spy = spyOn(service.notificationService, 'sendNotification');

      try {
        await service.SignIn('gu_lacha@live.concordia.ca', '123456');
      } catch (error) {
        expect(spy).toHaveBeenCalledWith(
          'Please verify your email before login'
        );
      }
    });


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

  describe('SignUp', () => {
    it('should handle error when email is already in use', async () => {
      spyOn(service.afAuth, 'createUserWithEmailAndPassword').and.returnValue(
        Promise.reject({ code: 'auth/email-already-in-use' })
      );
      const spy = spyOn(service.notificationService, 'sendAlert');

      const result = await service.SignUp(
        email,
        password,
        Authority.Public.toString()
      );

      expect(result).toBe('');
      expect(spy).toHaveBeenCalledWith('Error: Email already in use');
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

  describe('SignOut', () => {
    it('should sign out, remove user from local storage and navigate to login', async () => {
      const spySignOut = spyOn(service.afAuth, 'signOut').and.returnValue(
        Promise.resolve()
      );
      const spyRemoveItem = spyOn(localStorage, 'removeItem');
      const spyNavigate = spyOn(service.router, 'navigate');

      await service.SignOut();

      expect(spySignOut).toHaveBeenCalled();
      expect(spyRemoveItem).toHaveBeenCalledWith('user');
      expect(spyNavigate).toHaveBeenCalledWith(['login']);
    });
  });
});
