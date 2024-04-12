import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AppModule } from '../app.module';
import { PaymentGuard } from './payment.guard';
import { AuthService } from './auth.service';
import { RouterTestingModule } from '@angular/router/testing';


describe('paymentGuard', () => {
  let guard: PaymentGuard;
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, RouterTestingModule],
      providers: [
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate')
          }
        },
        { provide: AuthService, useValue: jasmine.createSpyObj('AuthService', ['']) },
      ]
    });
    guard = TestBed.inject(PaymentGuard);
    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should redirect and return false if returnUrl is not set', () => {
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify({ photoURL: 'Public' }));
    const routeMock: any = { queryParams: {} };
    const routeStateMock: any = { snapshot: {}, url: '/' };

    expect(guard.canActivate(routeMock, routeStateMock)).toEqual(false);
    expect(router.navigate).toHaveBeenCalledWith(['']);
  });

  it('should redirect and return false if returnUrl is correct but user is not public', () => {
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify({ photoURL: 'Private' }));
    const routeMock: any = { queryParams: { returnUrl: '/individual-condo?sourcePage=propertiesPage' } };
    const routeStateMock: any = { snapshot: {}, url: '/' };

    expect(guard.canActivate(routeMock, routeStateMock)).toEqual(false);
    expect(router.navigate).toHaveBeenCalledWith(['']);
  });
});
