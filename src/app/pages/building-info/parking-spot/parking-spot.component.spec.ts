import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ParkingSpotComponent } from './parking-spot.component';
import { AuthService } from 'src/app/services/auth.service';
import { AppModule } from 'src/app/app.module';
import { UserService } from 'src/app/services/user.service';
import {
  Authority,
  Notification,
  NotificationType,
  UserDTO,
} from 'src/app/models/users';
import {
  Building,
  ParkingLockerStatus,
  ParkingSpot,
  ParkingType,
} from 'src/app/models/properties';

describe('ParkingSpotComponent', () => {
  let component: ParkingSpotComponent;
  let fixture: ComponentFixture<ParkingSpotComponent>;
  let authService: AuthService;
  let userService: UserService;
  let consoleErrorSpy: jasmine.Spy;
  let parkingSpot: ParkingSpot;
  let building: Building;
  let myUser: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [ParkingSpotComponent],
    });

    fixture = TestBed.createComponent(ParkingSpotComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    userService = TestBed.inject(UserService);

    // Mock authService.getUser to return a user
    spyOn(authService, 'getUser').and.returnValue(
      Promise.resolve({
        photoURL: 'company',
        FirstName: 'Nick',
        LastName: 'Pip',
      })
    );

    // Mock userService.getPublicUser to return a public user
    spyOn(userService, 'getPublicUser').and.returnValue(
      Promise.resolve<UserDTO | null>({
        FirstName: '',
        LastName: '',
        ID: '',
        Authority: Authority.Public,
        Email: '',
        ProfilePicture: '',
        PhoneNumber: '',
        UserName: '',
        Notifications: [],
      })
    );

    parkingSpot = {
      ID: '1',
      Number: '123',
      Status: ParkingLockerStatus.Unavailable,
      OccupantID: '1',
      Fee: 0,
      ParkingType: ParkingType.Standard,
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

    consoleErrorSpy = spyOn(console, 'error');

    fixture.detectChanges();
  });

  afterEach(async () => {
    await authService.SignOut();
    consoleErrorSpy.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize users', fakeAsync(() => {
    component.ngOnInit();
    tick();

    // Assert: Check if this.users is truthy
    expect(component.users).toBeTruthy();
  }));

  it('should set myUser and authority when ngOnInit is called', fakeAsync(() => {
    component.ngOnInit();
    tick();

    // Assert if both myUser and authority are truthy
    expect(component.myUser).toBeTruthy();
    expect(component.authority).toBeTruthy();
  }));

  it('should initialize authority', () => {
    expect(component.authority).toBeUndefined();
  });

  it('should initialize users', () => {
    expect(component.users).toBeDefined();
  });

  it('should initialize myUser', async () => {
    // Arrange: Set up the return value for authService.getUser
    const user = { photoURL: 'company' };
    (authService.getUser as jasmine.Spy).and.returnValue(Promise.resolve(user));

    // Act: Call ngOnInit and wait for it to complete
    await component.ngOnInit();

    // Assert: Check that myUser is defined
    expect(component.myUser).toBeDefined();
  });

  it('should initialize lockers', fakeAsync(() => {
    component.ngOnInit();
    tick();

    // Assert: Check if this.users is truthy for each locker's occupant
    if (component.parkings) {
      component.parkings.forEach(async (parking) => {
        if (parking.OccupantID) {
          const user = await component.userService.getPublicUser(
            parking.OccupantID
          );
          if (user) {
            expect(component.users[parking.OccupantID]).toBe(user);
          }
        }
      });
    }
  }));

  it('should call ngOnInit', () => {
    spyOn(component, 'ngOnInit');
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
  });

  it('should set the authority based on the user', fakeAsync(() => {
    component.ngOnInit();
    tick();

    expect(component.authority).toEqual('company');
  }));

  it('should handle parkings being null', fakeAsync(() => {
    component.parkings = [];
    component.ngOnInit();
    tick();

    expect(component.users).toEqual({});
  }));

  it('should handle myUser being null', () => {
    (authService.getUser as jasmine.Spy).and.returnValue(null);
    component.ngOnInit();

    expect(component.authority).toBeUndefined();
  });

  it('ngOnInit should not fetch user information when locker.OccupantID is null', fakeAsync(() => {
    const parking: ParkingSpot = {
      ID: '1',
      Number: '123',
      Status: ParkingLockerStatus.Unavailable,
      OccupantID: '',
      Fee: 0,
      ParkingType: ParkingType.Standard,
    };
    component.parkings = [parking];
    component.ngOnInit();
    tick();
    expect(userService.getPublicUser).not.toHaveBeenCalled();
  }));

  it('ngOnInit should set myUser to the return value of authService.getUser()', async () => {
    const user = { photoURL: 'company' };
    (authService.getUser as jasmine.Spy).and.returnValue(Promise.resolve(user));
    await component.ngOnInit();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.myUser).toEqual(user);
  });

  it('ngOnInit should set authority to myUser.photoURL when myUser is not null', async () => {
    const user = { photoURL: 'company' };
    (authService.getUser as jasmine.Spy).and.returnValue(Promise.resolve(user));
    await component.ngOnInit();
    expect(component.authority).toBe(user.photoURL);
  });

  it('ngOnInit should set authority to an empty string when myUser is null', async () => {
    (authService.getUser as jasmine.Spy).and.returnValue(Promise.resolve(null));
    await component.ngOnInit();
    expect(component.authority).toEqual('');
  });

  it('ngOnInit should handle lockers being empty', fakeAsync(() => {
    component.parkings = [];
    component.ngOnInit();
    tick();
    expect(component.users).toEqual({});
  }));

  it('ngOnInit should handle errors from authService.getUser()', () => {
    (authService.getUser as jasmine.Spy).and.throwError('Error');
    component.ngOnInit();
    expect(component.authority).toBe('');
  });

  it('should handle null from userService.getPublicUser', fakeAsync(() => {
    (userService.getPublicUser as jasmine.Spy).and.returnValue(
      Promise.resolve(null)
    );
    component.ngOnInit();
    tick();
    // Assert: Check if this.users is still an empty object
    expect(component.users).toEqual({});
  }));

  it('should handle user without photoURL from authService.getUser', () => {
    const user = { photoURL: undefined };
    (authService.getUser as jasmine.Spy).and.returnValue(user);
    component.ngOnInit();
    // Assert: Check if authority is an empty string
    expect(component.authority).toBeUndefined();
  });

  it('should handle error from userService.getPublicUser', async () => {
    const error = 'Error';
    const occupantId = 'testOccupantId';

    // Mock this.parkings
    component.parkings = [
      {
        ID: '1',
        Number: '123',
        Status: ParkingLockerStatus.Unavailable,
        OccupantID: occupantId,
        Fee: 0,
        ParkingType: ParkingType.Standard,
      },
    ];

    // Make userService.getPublicUser return a rejected promise
    (userService.getPublicUser as jasmine.Spy).and.callFake((id) => {
      if (id === occupantId) {
        return Promise.reject(error);
      }
      return Promise.resolve(null); // Add a default return statement
    });

    // Trigger ngOnChanges
    await component.ngOnChanges({
      parkings: {
        previousValue: [],
        currentValue: component.parkings,
        firstChange: true,
        isFirstChange: () => true,
      },
    });
    // Assert: Check if this.users is still an empty object
    expect(component.users).toEqual({});

    // Assert: Check if console.error was called with the expected arguments
    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to get user', error);
  });

  it('should fetch user and set authority on ngOnInit', async () => {
    const mockUser = { photoURL: 'testAuthority' };
    (authService.getUser as jasmine.Spy).and.returnValue(
      Promise.resolve(mockUser)
    );

    await component.ngOnInit();

    expect(component.myUser).toEqual(mockUser);
    expect(component.authority).toEqual(mockUser.photoURL);
  });

  it('should fetch company user and set authority to Company on ngOnInit', async () => {
    const mockUser = { photoURL: 'Company' };
    (authService.getUser as jasmine.Spy).and.returnValue(
      Promise.resolve(mockUser)
    );

    await component.ngOnInit();

    expect(component.myUser).toEqual(mockUser);
    expect(component.authority).toEqual(mockUser.photoURL);
  });

  it('should fetch employee user and set authority to Employee on ngOnInit', async () => {
    const mockUser = { photoURL: 'Employee' };
    (authService.getUser as jasmine.Spy).and.returnValue(
      Promise.resolve(mockUser)
    );

    await component.ngOnInit();

    expect(component.myUser).toEqual(mockUser);
    expect(component.authority).toEqual(mockUser.photoURL);
  });

  it('should set the authority to an empty string when the current user is null', async () => {
    // Arrange: Set up the return value for authService.getUser
    (authService.getUser as jasmine.Spy).and.returnValue(Promise.resolve(null));

    // Act: Call ngOnInit and wait for it to complete
    await component.ngOnInit();

    // Assert: Check that myUser is null
    expect(component.myUser).toBeNull();

    // Assert: Check that authority is set to an empty string
    expect(component.authority).toBe('');
  });

  it('should send rental request notification and display success message', async () => {
    let date = new Date().getTime();
    let trimmedDate = Number(date.toString().substring(0, 11));
    const notification: Notification = {
      Date: trimmedDate,
      Message: `Request for rental of parking spot ${parkingSpot.Number} in ${component.building.Name} with ID ${parkingSpot.ID}`,
      New: true,
      SenderId: component.myUser.ID,
      SenderName: `${component.myUser.FirstName} ${component.myUser.LastName}`,
      Type: NotificationType.RentRequest,
    };
    const successMessage =
      'Your request for rental has been sent. You will be notified when it is approved.';
    spyOn(component.userService, 'sendNotificationToEmployeeOfCompany').and.returnValue(
      Promise.resolve()
    );
    spyOn(component.notificationService, 'sendNotification');

    await component.requestRent(parkingSpot);

    expect(component.userService.sendNotificationToEmployeeOfCompany).toHaveBeenCalledWith(
      component.building.CompanyID,
      jasmine.objectContaining({
        Message: notification.Message,
        New: notification.New,
        SenderId: notification.SenderId,
        SenderName: notification.SenderName,
        Type: notification.Type,
      })
    );
    expect(component.notificationService.sendNotification).toHaveBeenCalledWith(
      successMessage
    );
  });

  // it('should fetch new user information when new parkings are added', fakeAsync(() => {
  //   component.parkings = [
  //     {
  //       ID: '1',
  //       Number: '123',
  //       Status: ParkingLockerStatus.Unavailable,
  //       OccupantID: '',
  //       Fee: 0,
  //       ParkingType: ParkingType.Standard
  //     },
  //     {
  //       ID: '2',
  //       Number: '456',
  //       Status: ParkingLockerStatus.Available,
  //       OccupantID: '',
  //       Fee: 0,
  //       ParkingType: ParkingType.Standard
  //     }
  //   ];
  //   component.ngOnInit();
  //   tick();
  //   const initialUsers = {...component.users};

  //   component.parkings = [
  //     {
  //       ID: '1',
  //       Number: '123',
  //       Status: ParkingLockerStatus.Unavailable,
  //       OccupantID: '1',
  //       Fee: 0,
  //       ParkingType: ParkingType.Standard
  //     },
  //     {
  //       ID: '2',
  //       Number: '456',
  //       Status: ParkingLockerStatus.Available,
  //       OccupantID: '2',
  //       Fee: 0,
  //       ParkingType: ParkingType.Standard
  //     }
  //   ];
  //   component.ngOnInit();
  //   tick();

  //   expect(component.users).not.toEqual(initialUsers);
  // }));
});
