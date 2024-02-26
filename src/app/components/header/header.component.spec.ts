import {
  ComponentFixture,
  TestBed,
  TestBedStatic,
} from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { AppModule } from 'src/app/app.module';
import { AuthService } from 'src/app/services/auth.service';
import { CompanyDTO, EmployeeDTO, UserDTO } from 'src/app/models/users';
import { of, Subscription } from 'rxjs';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authService: AuthService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [HeaderComponent],
    });
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    authService = TestBed.inject(AuthService);
  });

  afterEach(async () => {
    await authService.SignOut();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve user data on initialization', async () => {
    spyOn(component, 'getUserData').and.callThrough();
    await component.ngOnInit();
    expect(component.getUserData).toHaveBeenCalled();
  });

  it('should retrieve user data', async () => {
    await authService.SignIn('dojefe6817@giratex.com', '123456');
    await component.getUserData();
    expect(component.myUser).toBeTruthy();
  });

  it('should retrieve company user data', async () => {
    await authService.SignIn('wasaf62813@evvgo.com', '123456');
    await component.getUserData();
    const Company = component.myUser as CompanyDTO;
    expect(Company.CompanyName).toEqual('Better call Saul');
  });

  it('should retrieve employee user data', async () => {
    await authService.SignIn('sanic29650@gosarlar.com', '123456');
    await component.getUserData();
    const Employee = component.myUser as EmployeeDTO;
    expect(Employee.CompanyName).toEqual('Better call Saul');
  });

  it('should retrieve public user data', async () => {
    await authService.SignIn('dojefe6817@giratex.com', '123456');
    await component.getUserData();
    const Public = component.myUser as UserDTO;
    expect(Public.FirstName).toEqual('Nick');
  });

  it('should call getUserData after subscribing to currentUser$', async () => {
    const mockUser = { firstName: 'John', lastName: 'Doe' };
    const mockSubscription = new Subscription();
    spyOn(component.userService.currentUser$, 'subscribe').and.callFake(
      (observerOrNext) => {
        if (typeof observerOrNext === 'function') {
          observerOrNext(mockUser);
        } else if (
          observerOrNext &&
          typeof observerOrNext.next === 'function'
        ) {
          observerOrNext.next(mockUser);
        }
        return mockSubscription;
      }
    );
    spyOn(component, 'getUserData');

    await component.ngOnInit();

    expect(component.getUserData).toHaveBeenCalled();
  });

  it('should call getUserData after subscribing to currentUser$', async () => {
    const mockSubscription = new Subscription();
    spyOn(component.userService.currentUser$, 'subscribe').and.returnValue(
      mockSubscription
    );
    spyOn(component, 'getUserData');

    await component.ngOnInit();

    expect(component.getUserData).toHaveBeenCalled();
  });
});