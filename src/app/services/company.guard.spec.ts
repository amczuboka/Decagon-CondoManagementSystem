import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AppModule } from '../app.module';

import { CompanyGuard } from './company.guard';

describe('companyGuard', () => {
  let guard: CompanyGuard;
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
    guard = TestBed.inject(CompanyGuard);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivate', () => {
    it('should return true if user is logged in and is a company', () => {
      const user = { photoURL: 'Company' };
      spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(user));

      const result = guard.canActivate();

      expect(result).toBeTrue();
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should navigate to "" if user is not a company', () => {
      const user = { photoURL: 'Public' };
      spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(user));

      const result = guard.canActivate();

      expect(result).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['']);
    });
  });
});
