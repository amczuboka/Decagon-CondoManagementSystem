import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPageComponent } from './request-page.component';
import { AppModule } from 'src/app/app.module';
import { AuthService } from 'src/app/services/auth.service';
import { Building } from 'src/app/models/properties';
import { Authority, NotificationType } from 'src/app/models/users';

describe('RequestPageComponent', () => {
  let component: RequestPageComponent;
  let fixture: ComponentFixture<RequestPageComponent>;
  let authService: AuthService;
  let building: Building;
  let myUser: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [RequestPageComponent],
    });
    fixture = TestBed.createComponent(RequestPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    authService = TestBed.inject(AuthService);

    building = {
      ID: '1',
      Year: 2022,
      CompanyID: 'company1',
      Name: 'Building 1',
      Address: '123 Main St',
      Bookings: [],
      Description: 'Building description',
      Parkings: [],
      Lockers: [],
      Condos: [],
      Picture: '',
      Facilities: [],
    };
    myUser = {
      ID: '1',
      FirstName: 'John',
      LastName: 'Doe',
      Authority: Authority.Company,
    };
    component.building = building;
    component.myUser = myUser;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch user and set authority on ngOnInit', async () => {
    const mockUser = { photoURL: 'testAuthority' };
    spyOn(authService, 'getUser').and.returnValue(Promise.resolve(mockUser));

    await component.ngOnInit();

    expect(component.myUser).toEqual(mockUser);
    expect(component.authority).toEqual(mockUser.photoURL);
  });

  it('should fetch public user and set authority to Public on ngOnInit', async () => {
    const mockUser = { photoURL: 'Public' };
    spyOn(authService, 'getUser').and.returnValue(Promise.resolve(mockUser));

    await component.ngOnInit();

    expect(component.myUser).toEqual(mockUser);
    expect(component.authority).toEqual(mockUser.photoURL);
  });

  it('should fetch company user and set authority to Company on ngOnInit', async () => {
    const mockUser = { photoURL: 'Company' };
    spyOn(authService, 'getUser').and.returnValue(Promise.resolve(mockUser));

    await component.ngOnInit();

    expect(component.myUser).toEqual(mockUser);
    expect(component.authority).toEqual(mockUser.photoURL);
  });

  it('should fetch employee user and set authority to Employee on ngOnInit', async () => {
    const mockUser = { photoURL: 'Employee' };
    spyOn(authService, 'getUser').and.returnValue(Promise.resolve(mockUser));

    await component.ngOnInit();

    expect(component.myUser).toEqual(mockUser);
    expect(component.authority).toEqual(mockUser.photoURL);
  });

  it('should submit the form and reset it when valid', async () => {
    // Arrange
    spyOn(console, 'warn');
    spyOn(console, 'log');
    spyOn(component.notificationService, 'sendAlert');
    spyOn(component.notificationService, 'sendNotification');
    spyOn(component, 'sendRequest').and.returnValue(Promise.resolve());
    spyOn(component.requestForm, 'reset');

    // Act
    component.requestForm.setValue({
      RequestType: NotificationType.SecurityRequest,
      Comments: 'Test comments',
    });
    await component.onSubmit();

    // Assert
    expect(console.warn).toHaveBeenCalledWith('Your order has been submitted', {
      RequestType: NotificationType.SecurityRequest,
      Comments: 'Test comments',
    });
    expect(console.log).toHaveBeenCalledWith('Form is valid');
    expect(component.sendRequest).toHaveBeenCalled();
    expect(component.requestForm.reset).toHaveBeenCalled();
    expect(component.notificationService.sendNotification).toHaveBeenCalledWith(
      'Your request has been submitted.'
    );
  });

  it('should display an alert when the form is invalid', async () => {
    // Arrange
    spyOn(console, 'warn');
    spyOn(console, 'log');
    spyOn(component.notificationService, 'sendAlert');
    spyOn(component.notificationService, 'sendNotification');
    spyOn(component, 'sendRequest');

    // Act
    component.requestForm.setValue({
      RequestType: null,
      Comments: null,
    });
    spyOn(component.requestForm, 'reset');
    await component.onSubmit();

    // Assert
    expect(console.warn).toHaveBeenCalledWith(
      'Your order has been submitted',
      component.requestForm.value
    );
    expect(console.log).toHaveBeenCalledWith('Form is invalid');
    expect(component.sendRequest).not.toHaveBeenCalled();
    expect(component.requestForm.reset).not.toHaveBeenCalled();
    expect(component.notificationService.sendAlert).toHaveBeenCalledWith(
      'You must select a request type.'
    );
  });

  it('should send a notification when sendRequest is called', async () => {
    // Arrange
    const notification = {
      Date: jasmine.any(Number),
      Message: 'Test comments',
      New: true,
      SenderId: '1',
      SenderName: 'John Doe',
      Type: NotificationType.SecurityRequest,
    };
    spyOn(component.userService, 'sendNotificationToUser');

    // Set form values
    component.requestForm.setValue({
      RequestType: NotificationType.SecurityRequest,
      Comments: 'Test comments',
    });

    // Act
    await component.sendRequest();

    // Assert
    expect(component.userService.sendNotificationToUser).toHaveBeenCalledWith(
      component.building.CompanyID,
      Authority.Company,
      notification
    );
  });
});
