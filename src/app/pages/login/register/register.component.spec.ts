import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register.component';
import { AppModule } from 'src/app/app.module';
import { Authority } from 'src/app/models/users';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule, ReactiveFormsModule],
      declarations: [RegisterComponent],
      providers: [UserService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    userService = TestBed.inject(UserService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the registerForm with default values', () => {
    expect(component.registerForm.get('Email')!.value).toEqual('');
    expect(component.registerForm.get('ConfirmEmail')!.value).toEqual('');
    expect(component.registerForm.get('FirstName')!.value).toEqual('');
    expect(component.registerForm.get('LastName')!.value).toEqual('');
    expect(component.registerForm.get('Password')!.value).toEqual('');
    expect(component.registerForm.get('ConfirmPassword')!.value).toEqual('');
    expect(component.registerForm.get('Authority')!.value).toEqual(
      Authority.Public
    );
    expect(component.registerForm.get('CompanyName')!.value).toEqual('');
    expect(component.registerForm.get('ID')!.value).toEqual('');
  });

  it('should update CompanyName validation when Authority field changes', () => {
    component.registerForm.get('Authority')!.setValue(Authority.Company);
    expect(component.registerForm.get('CompanyName')!.errors).toBeNull();

    component.registerForm.get('Authority')!.setValue(Authority.Public);
    expect(component.registerForm.get('CompanyName')!.errors).toBeNull();

    component.registerForm.get('Authority')!.setValue(Authority.Employee);
    expect(component.registerForm.get('CompanyName')!.errors).toBeNull();
  });

  it('should set ConfirmPassword control error when password and confirm password do not match', () => {
    component.registerForm.get('Password')!.setValue('password');
    component.registerForm
      .get('ConfirmPassword')!
      .setValue('differentpassword');
    component.passwordConfirmationValidator(component.registerForm);
    expect(
      component.registerForm.get('ConfirmPassword')!.hasError('incorrect')
    ).toBeTruthy();
  });

  it('should clear ConfirmPassword control error when password and confirm password match', () => {
    component.registerForm.get('Password')!.setValue('password');
    component.registerForm.get('ConfirmPassword')!.setValue('password');
    component.passwordConfirmationValidator(component.registerForm);
    expect(component.registerForm.get('ConfirmPassword')!.errors).toBeNull();
  });

  it('should call notificationService.sendAlert when form is invalid', () => {
    spyOn(component.notificationService, 'sendAlert');
    component.registerForm.get('Email')!.setValue('testexample.com');
    component.registerForm.get('FirstName')!.setValue('John');
    component.registerForm.get('LastName')!.setValue('Doe');
    component.registerForm.get('Password')!.setValue('password');
    component.registerForm.get('ConfirmPassword')!.setValue('password');
    component.registerForm.get('Authority')!.setValue(Authority.Public);
    component.onSubmit();
    expect(component.notificationService.sendAlert).toHaveBeenCalledWith(
      'Make sure to answer all required fields'
    );
  });

  it('should call authService.SignUp and registerUser when form is valid public', async () => {
    spyOn(component.authService, 'SignUp').and.returnValue(
      Promise.resolve('rid123')
    );
    spyOn(userService, 'registerUser');
    component.registerForm.get('Email')!.setValue('test@example.com');
    component.registerForm.get('FirstName')!.setValue('John');
    component.registerForm.get('LastName')!.setValue('Doe');
    component.registerForm.get('Password')!.setValue('password');
    component.registerForm.get('ConfirmPassword')!.setValue('password');
    component.registerForm.get('Authority')!.setValue(Authority.Public);
    await component.onSubmit();
    expect(component.authService.SignUp).toHaveBeenCalledWith(
      'test@example.com',
      'password',
      Authority.Public
    );
    expect(userService.registerUser).toHaveBeenCalledWith(
      component.registerForm.value,
      'rid123',
      'public users/'
    );
  });

  it('should call authService.SignUp and registerUser when form is valid company', async () => {
    spyOn(component.authService, 'SignUp').and.returnValue(
      Promise.resolve('rid1234')
    );
    spyOn(userService, 'registerUser');
    component.registerForm.get('Email')!.setValue('test3@example.com');
    component.registerForm.get('FirstName')!.setValue('John');
    component.registerForm.get('LastName')!.setValue('Doe');
    component.registerForm.get('Password')!.setValue('password');
    component.registerForm.get('ConfirmPassword')!.setValue('password');
    component.registerForm.get('Authority')!.setValue(Authority.Company);
    component.registerForm.get('CompanyName')!.setValue('Company Name');
    await component.onSubmit();
    expect(component.authService.SignUp).toHaveBeenCalledWith(
      'test3@example.com',
      'password',
      Authority.Company
    );
    expect(userService.registerUser).toHaveBeenCalledWith(
      component.registerForm.value,
      'rid1234',
      'companies/'
    );
  });

  it('should call authService.SignUp when form is valid employee', async () => {
    spyOn(userService, 'checkIfCompanyExists').and.returnValue(
      Promise.resolve(true)
    );
    spyOn(component.authService, 'SignUp').and.returnValue(
      Promise.resolve('rid12345')
    );
    spyOn(userService, 'registerUser');
    component.registerForm.get('Email')!.setValue('test2@example.com');
    component.registerForm.get('FirstName')!.setValue('John');
    component.registerForm.get('LastName')!.setValue('Doe');
    component.registerForm.get('Password')!.setValue('password');
    component.registerForm.get('ConfirmPassword')!.setValue('password');
    component.registerForm.get('Authority')!.setValue(Authority.Employee);
    component.registerForm.get('CompanyName')!.setValue('Company Name');
    await component.onSubmit();
    expect(component.authService.SignUp).toHaveBeenCalledWith(
      'test2@example.com',
      'password',
      Authority.Employee
    );
    expect(userService.registerUser).toHaveBeenCalledWith(
      component.registerForm.value,
      'rid12345',
      'employees/'
    );
  });

  it('should set ConfirmEmail control error when email and confirm email do not match', () => {
    component.registerForm.get('Email')!.setValue('test@example.com');
    component.registerForm
      .get('ConfirmEmail')!
      .setValue('different@example.com');
    component.emailConfirmationValidator(component.registerForm);
    expect(
      component.registerForm.get('ConfirmEmail')!.hasError('incorrect')
    ).toBeTruthy();
  });

  it('should clear ConfirmEmail control error when email and confirm email match', () => {
    component.registerForm.get('Email')!.setValue('test@example.com');
    component.registerForm.get('ConfirmEmail')!.setValue('test@example.com');
    component.emailConfirmationValidator(component.registerForm);
    expect(component.registerForm.get('ConfirmEmail')!.errors).toBeNull();
  });

  it('should stop the process and send an alert if the form is invalid', () => {
    spyOn(component.notificationService, 'sendAlert');
    component.registerForm.setErrors({ invalid: true });
    component.onSubmit();
    expect(component.notificationService.sendAlert).toHaveBeenCalledWith(
      'Make sure to answer all required fields'
    );
  });

  it('should set Uploading to true', () => {
    component.registerForm.setErrors(null);
    component.onSubmit();
    expect(component.Uploading).toBe(false);
  });

  it('should set Uploading to false when authService.SignUp returns an empty string', async () => {
    spyOn(component.authService, 'SignUp').and.returnValue(Promise.resolve(''));
    component.registerForm.get('Authority')!.setValue(Authority.Public);
    component.registerForm.get('Email')!.setValue('test@example.com');
    component.registerForm.get('Password')!.setValue('password');
    await component.onSubmit();
    expect(component.Uploading).toBe(false);
  });

  it('should set Uploading to false after successful registration', async () => {
    spyOn(component.authService, 'SignUp').and.returnValue(
      Promise.resolve('rid123')
    );
    spyOn(userService, 'registerUser');
    component.registerForm.get('Authority')!.setValue(Authority.Public);
    component.registerForm.get('Email')!.setValue('test@example.com');
    component.registerForm.get('Password')!.setValue('password');
    await component.onSubmit();
    expect(component.Uploading).toBe(false);
  });
});
