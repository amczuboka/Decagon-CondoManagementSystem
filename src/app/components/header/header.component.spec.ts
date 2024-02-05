import {
  ComponentFixture,
  TestBed,
  TestBedStatic,
} from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { AppModule } from 'src/app/app.module';
import { AuthService } from 'src/app/services/auth.service';
import { CompanyDTO, EmployeeDTO, UserDTO } from 'src/app/models/users';

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
});
