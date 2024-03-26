import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { AppModule } from 'src/app/app.module';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule, ReactiveFormsModule],
      declarations: [LoginComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize loginForm with empty values', () => {
    expect(component.loginForm.value).toEqual({
      Email: '',
      Password: '',
    });
  });

  it('should show error message if form is invalid', () => {
    spyOn(component.notificationService, 'sendAlert');
    component.onSubmit();
    expect(component.notificationService.sendAlert).toHaveBeenCalledWith(
      'Make sure to answer all required fields'
    );
  });

  it('should call authService.SignIn with correct parameters', async () => {
    spyOn(component.authService, 'SignIn');
    component.loginForm.setValue({
      Email: 'test@example.com',
      Password: 'password123',
    });
    await component.onSubmit();
    expect(component.authService.SignIn).toHaveBeenCalledWith(
      'test@example.com',
      'password123'
    );
  });

  it('should call userService.getCompanyUser if myUser.photoURL is Authority.Company', async () => {
    spyOn(component.authService, 'SignIn');
    spyOn(component.userService, 'getCompanyUser').and.returnValue(
      Promise.resolve({}) as any
    );
    spyOn(component.userService, 'updateUser');
    component.loginForm.setValue({
      Email: 'test@example.com',
      Password: 'password123',
    });
    component.authService.getUser = jasmine.createSpy().and.returnValue({
      uid: '123',
      photoURL: 'Company',
    });
    await component.onSubmit();
    expect(component.userService.getCompanyUser).toHaveBeenCalledWith('123');
    expect(component.userService.updateUser).toHaveBeenCalled();
  });

  it('should call userService.getPublicUser if myUser.photoURL is Authority.Employee', async () => {
    spyOn(component.authService, 'SignIn');
    spyOn(component.userService, 'getEmployeeUser').and.returnValue(
      Promise.resolve({}) as any
    );
    spyOn(component.userService, 'updateUser');
    component.loginForm.setValue({
      Email: 'test@example.com',
      Password: 'password123',
    });
    component.authService.getUser = jasmine.createSpy().and.returnValue({
      uid: '123',
      photoURL: 'Employee',
    });
    await component.onSubmit();
    expect(component.userService.getEmployeeUser).toHaveBeenCalledWith('123');
    expect(component.userService.updateUser).toHaveBeenCalled();
  });

  it('should call userService.getPublicUser if myUser.photoURL is not Authority.Company or Authority.Employee', async () => {
    spyOn(component.authService, 'SignIn');
    spyOn(component.userService, 'getPublicUser').and.returnValue(
      Promise.resolve({}) as any
    );
    spyOn(component.userService, 'updateUser');
    component.loginForm.setValue({
      Email: 'test@example.com',
      Password: 'password123',
    });
    component.authService.getUser = jasmine.createSpy().and.returnValue({
      uid: '123',
      photoURL: 'Public',
    });
    await component.onSubmit();
    expect(component.userService.getPublicUser).toHaveBeenCalledWith('123');
    expect(component.userService.updateUser).toHaveBeenCalled();
  });

  it('should set loading to false after form submission', async () => {
    spyOn(component.authService, 'SignIn');
    component.loginForm.setValue({
      Email: 'test@example.com',
      Password: 'password123',
    });
    await component.onSubmit();
    expect(component.loading).toBeFalse();
  });

  it('should sign out, update user, and show alert if user is not found or account is disabled', async () => {
    spyOn(component.authService, 'SignIn');
    spyOn(component.userService, 'getEmployeeUser').and.returnValue(
      Promise.resolve(null) as any
    );
    spyOn(component.authService, 'SignOut');
    spyOn(component.userService, 'updateUser');
    spyOn(component.notificationService, 'sendAlert');
    component.loginForm.setValue({
      Email: 'moses60822@shaflyn.com',
      Password: '123456',
    });
    component.authService.getUser = jasmine.createSpy().and.returnValue({
      uid: '123',
      photoURL: 'Employee',
    });
    await component.onSubmit();
    expect(component.authService.SignOut).toHaveBeenCalled();
    expect(component.userService.updateUser).toHaveBeenCalledWith(null);
    expect(component.notificationService.sendAlert).toHaveBeenCalledWith(
      'User not found or account disabled'
    );
  });
});
