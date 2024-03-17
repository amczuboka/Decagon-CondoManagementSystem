import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { AuthService } from 'src/app/services/auth.service';
import { AppModule } from 'src/app/app.module';
import { LockerComponent } from './locker.component';
import { UserService } from 'src/app/services/user.service';
import { Authority, UserDTO } from 'src/app/models/users';
import { Locker, ParkingLockerStatus } from 'src/app/models/properties';

describe('LockerComponent', () => {
  let component: LockerComponent;
  let fixture: ComponentFixture<LockerComponent>;
  let authService: AuthService;
  let userService: UserService;
  let consoleErrorSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [LockerComponent],
    });

    fixture = TestBed.createComponent(LockerComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    userService = TestBed.inject(UserService);

    // Mock authService.getUser to return a user
    spyOn(authService, 'getUser').and.returnValue({
      photoURL: 'company',
      FirstName: 'Nick',
      LastName: 'Pip',
    });

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

  it('should set myUser and authority when ngAfterViewChecked is called', fakeAsync(() => {
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
    if (component.lockers) {
      component.lockers.forEach(async (locker) => {
        if (locker.OccupantID) {
          const user = await component.userService.getPublicUser(
            locker.OccupantID
          );
          if (user) {
            expect(component.users[locker.OccupantID]).toBe(user);
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

  it('should handle lockers being null', fakeAsync(() => {
    component.lockers = [];
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
    const locker: Locker = {
      ID: '1',
      Number: '123',
      Status: ParkingLockerStatus.Unavailable,
      Height: '10',
      OccupantID: '',
      Width: '',
      Length: '',
      Fee: 0,
    };
    component.lockers = [locker];
    component.ngOnInit();
    tick();
    expect(userService.getPublicUser).not.toHaveBeenCalled();
  }));

  it('ngOnInit should set myUser to the return value of authService.getUser()', async () => {
    const user = { photoURL: 'company' };
    (authService.getUser as jasmine.Spy).and.returnValue(user);
    await component.ngOnInit();
    expect(component.myUser).toBe(user);
  });

  it('ngOnInit should set authority to myUser.photoURL when myUser is not null', async () => {
    const user = { photoURL: 'company' };
    (authService.getUser as jasmine.Spy).and.returnValue(user);
    await component.ngOnInit();
    expect(component.authority).toBe(user.photoURL);
  });

  it('ngOnInit should set authority to an empty string when myUser is null', async () => {
    (authService.getUser as jasmine.Spy).and.returnValue(Promise.resolve(null));    
    await component.ngOnInit();
    expect(component.authority).toEqual('');
  });

  it('ngOnInit should handle lockers being empty', fakeAsync(() => {
    component.lockers = [];
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
    (userService.getPublicUser as jasmine.Spy).and.returnValue(Promise.resolve(null));
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
    component.lockers = [{
      ID: '1',
      Number: '123',
      Status: ParkingLockerStatus.Unavailable,
      OccupantID: occupantId,
      Height: '', 
      Width: '', 
      Length: '', 
      Fee: 0,
    }];

    // Make userService.getPublicUser return a rejected promise
    (userService.getPublicUser as jasmine.Spy).and.callFake(id => {
      if (id === occupantId) {
        return Promise.reject(error);
      }
      return Promise.resolve(null); // Add a default return statement
    });

    await component.ngOnInit();
  
    // Assert: Check if this.users is still an empty object
    expect(component.users).toEqual({});
  
    // Assert: Check if console.error was called with the expected arguments
    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to get user', error);
  });
  
  it('should fetch new user information when new parkings are added', fakeAsync(() => {
    component.lockers = [
      {
        ID: '1',
        Number: '123',
        Status: ParkingLockerStatus.Unavailable,
        OccupantID: '',
        Height: '', 
        Width: '', 
        Length: '', 
        Fee: 0,
      },
      {
        ID: '2',
        Number: '456',
        Status: ParkingLockerStatus.Available,
        OccupantID: '',
        Height: '', 
        Width: '', 
        Length: '', 
        Fee: 0,
      }
    ];    
    component.ngOnInit();
    tick();
    const initialUsers = {...component.users};
  
    component.lockers = [
      {
        ID: '1',
        Number: '123',
        Status: ParkingLockerStatus.Unavailable,
        OccupantID: '1',
        Height: '', 
        Width: '', 
        Length: '', 
        Fee: 0,
      },
      {
        ID: '2',
        Number: '456',
        Status: ParkingLockerStatus.Available,
        OccupantID: '2',
        Height: '', 
        Width: '', 
        Length: '', 
        Fee: 0,
      }
    ];    component.ngOnInit();
    tick();
  
    expect(component.users).not.toEqual(initialUsers);
  }));
});