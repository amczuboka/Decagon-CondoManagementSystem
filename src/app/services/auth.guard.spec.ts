import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthguardGuard } from './auth.guard';
import { AppModule } from '../app.module';

describe('AuthguardGuard', () => {
  let guard: AuthguardGuard;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      providers: [
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate')
          }
        }
      ]
    });
    guard = TestBed.inject(AuthguardGuard);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivate', () => {
    it('should return true if user is logged in and email is verified', () => {
      const user = { emailVerified: true };
      spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(user));

      const result = guard.canActivate();

      expect(result).toBeTrue();
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should navigate to "verify-email" if user is logged in but email is not verified', () => {
      const user = { emailVerified: false };
      spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(user));

      const result = guard.canActivate();

      expect(result).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['verify-email']);
    });

    it('should navigate to "login" if user is not logged in', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);

      const result = guard.canActivate();

      expect(result).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['login']);
    });
  });
});