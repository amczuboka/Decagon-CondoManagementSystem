import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { VerifyEmailComponent } from './verify-email.component';
import { AppModule } from 'src/app/app.module';
import { AuthService } from 'src/app/services/auth.service';

describe('VerifyEmailComponent', () => {
  let component: VerifyEmailComponent;
  let fixture: ComponentFixture<VerifyEmailComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule, RouterTestingModule],
      declarations: [VerifyEmailComponent],
      providers: [AuthService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyEmailComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call SendVerificationMail method on resendVerificationEmail', async () => {
    spyOn(authService, 'SendVerificationMail');
    await component.resendVerificationEmail();
    expect(authService.SendVerificationMail).toHaveBeenCalled();
  });

  it('should call SignOut method on navigateToLogin if user is authenticated', () => {
    spyOn(authService, 'getUser').and.returnValue(true);
    spyOn(authService, 'SignOut');
    component.navigateToLogin();
    expect(authService.SignOut).toHaveBeenCalled();
  });

  it('should not call SignOut method on navigateToLogin if user is not authenticated', () => {
    spyOn(authService, 'getUser').and.returnValue(false);
    spyOn(authService, 'SignOut');
    component.navigateToLogin();
    expect(authService.SignOut).not.toHaveBeenCalled();
  });
});