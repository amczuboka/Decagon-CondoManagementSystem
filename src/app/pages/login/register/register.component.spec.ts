import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register.component';
import { AppModule } from 'src/app/app.module';
import { Authority } from 'src/app/models/users';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule, ReactiveFormsModule],
      declarations: [RegisterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
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

  it('should call authService.SignUp and registerUser when form is valid', async () => {
    spyOn(component.authService, 'SignUp').and.returnValue(
      Promise.resolve('rid123')
    );
    spyOn(component, 'registerUser');
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
    expect(component.registerUser).toHaveBeenCalledWith(
      component.registerForm.value,
      'rid123',
      'public users/'
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
});
