import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from 'src/app/app.module';

import { CondoComponent } from './condo.component';
import { AuthService } from 'src/app/services/auth.service';

describe('CondoComponent', () => {
  let component: CondoComponent;
  let fixture: ComponentFixture<CondoComponent>;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [CondoComponent],
    });
    fixture = TestBed.createComponent(CondoComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to key-registration page when requestOwnership() is called', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component.requestOwnership();
    expect(routerSpy).toHaveBeenCalledWith(['/key-registration']);
  });

  it('should fetch user and set authority on ngOnInit', async () => {
    const mockUser = { photoURL: 'testAuthority' };
    spyOn(authService, 'getUser').and.returnValue(Promise.resolve(mockUser));

    await component.ngOnInit();

    expect(component.myUser).toEqual(mockUser);
    expect(component.authority).toEqual(mockUser.photoURL);
  });

  it('should handle error from authService.getUser', async () => {
    const error = 'Error';
    spyOn(authService, 'getUser').and.returnValue(Promise.reject(error));
    const consoleErrorSpy = spyOn(console, 'error');

    await component.ngOnInit();

    expect(component.authority).toEqual('');
    expect(consoleErrorSpy).toHaveBeenCalledWith(error);
  });

  it('should set authority to empty string if user is null', async () => {
    spyOn(authService, 'getUser').and.returnValue(Promise.resolve(null));

    await component.ngOnInit();

    expect(component.authority).toEqual('');
  });
});
