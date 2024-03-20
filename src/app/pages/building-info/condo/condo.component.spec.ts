import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from 'src/app/app.module';

import { CondoComponent } from './condo.component';
import { AuthService } from 'src/app/services/auth.service';
import { Building, Condo, CondoStatus, CondoType } from 'src/app/models/properties';
import { Authority, Notification, NotificationType } from 'src/app/models/users';

describe('CondoComponent', () => {
  let component: CondoComponent;
  let fixture: ComponentFixture<CondoComponent>;
  let authService: AuthService;
  let condo: Condo;
  let building: Building;
  let myUser: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [CondoComponent],
    });
    fixture = TestBed.createComponent(CondoComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
    condo = {
      ID: '1',
      Type: CondoType.Sale,
      OccupantID: '',
      UnitNumber: '1',
      Fee: 1000,
      Picture: '',
      Description: 'test',
      NumberOfBedrooms: 2,
      NumberOfBathrooms: 2,
      Status: CondoStatus.Vacant,
      SquareFootage: 1000,
    };
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
      Facilities: []
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

  it('should send ownership request notification and display success message', async () => {
    const notification: Notification = {
      Date: new Date().getTime(),
      Message: `Request for ownership of unit ${condo.UnitNumber} in ${component.building.Name} with ID ${condo.ID}`,
      New: true,
      SenderId: component.myUser.ID,
      SenderName: `${component.myUser.FirstName} ${component.myUser.LastName}`,
      Type: NotificationType.OwnershipRequest,
    };
    const successMessage = 'Your request for ownership has been sent. You will be notified when it is approved.';
    spyOn(component.userService, 'sendNotificationToUser').and.returnValue(Promise.resolve());
    spyOn(component.notificationService, 'sendNotification');
  
    await component.requestOwnership(condo);
  
    expect(component.userService.sendNotificationToUser).toHaveBeenCalledWith(
      component.building.CompanyID,
      Authority.Company,
      notification
    );
    expect(component.notificationService.sendNotification).toHaveBeenCalledWith(successMessage);
  });

  it('should send rental request notification and display success message', async () => {
    const notification: Notification = {
      Date: new Date().getTime(),
      Message: `Request for rental of unit ${condo.UnitNumber} in ${component.building.Name} with ID ${condo.ID}`,
      New: true,
      SenderId: component.myUser.ID,
      SenderName: `${component.myUser.FirstName} ${component.myUser.LastName}`,
      Type: NotificationType.RentRequest,
    };
    const successMessage = 'Your request for rental has been sent. You will be notified when it is approved.';
    spyOn(component.userService, 'sendNotificationToUser').and.returnValue(Promise.resolve());
    spyOn(component.notificationService, 'sendNotification');
  
    await component.requestRent(condo);
  
    expect(component.userService.sendNotificationToUser).toHaveBeenCalledWith(
      component.building.CompanyID,
      Authority.Company,
      notification
    );
    expect(component.notificationService.sendNotification).toHaveBeenCalledWith(successMessage);
  });
});
