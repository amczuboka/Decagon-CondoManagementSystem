import {
  ComponentFixture,
  TestBed,
  TestBedStatic,
} from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { AppModule } from 'src/app/app.module';
import { AuthService } from 'src/app/services/auth.service';
import { of } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authService: AuthService;
  let userService: UserService;
  beforeEach(() => {
    const user = {
      FirstName: 'John',
      LastName: 'Doe',
      ID: '123',
      Authority: 'Public',
      Email: '',
      ProfilePicture: '',
      PhoneNumber: '',
      UserName: '',
    };
    const userServiceMock = {
      myUser: of(user),
      updateUser: jasmine.createSpy('updateUser').and.stub(),
    };

    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [HeaderComponent],
      providers: [{ provide: UserService, useValue: userServiceMock }],
    });
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    fixture.detectChanges();
    authService = TestBed.inject(AuthService);
  });

  afterEach(async () => {
    await authService.SignOut();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve new notifications on ngOnInit', () => {
    spyOn(component, 'getNewNotifications');

    component.ngOnInit();

    userService.myUser.subscribe((value) => {
      expect(value).toEqual(component.myUser);
    });
    expect(component.getNewNotifications).toHaveBeenCalled();
  });

  it('should retrieve new notifications', () => {
    component.myUser = {
      Notifications: [
        {
          New: true,
          Message: 'Notification 1',
          Date: new Date().getTime(),
          SenderId: '1',
        },
        {
          New: false,
          Message: 'Notification 2',
          Date: new Date().getTime(),
          SenderId: '2',
        },
        {
          New: true,
          Message: 'Notification 3',
          Date: new Date().getTime(),
          SenderId: '3',
        },
      ],
    };

    component.getNewNotifications();

    expect(component.newNotifications).toEqual([
      {
        New: true,
        Message: 'Notification 1',
        Date: new Date().getTime(),
        SenderId: '1',
      },
      {
        New: true,
        Message: 'Notification 3',
        Date: new Date().getTime(),
        SenderId: '3',
      },
    ]);
  });

  it('should not retrieve new notifications if myUser.Notifications is undefined', () => {
    component.myUser = {};

    component.getNewNotifications();

    expect(component.newNotifications).toEqual([]);
  });

  it('should not retrieve new notifications if myUser.Notifications is empty', () => {
    component.myUser = { Notifications: [] };

    component.getNewNotifications();

    expect(component.newNotifications).toEqual([]);
  });

  it('should not retrieve new notifications if no notification is marked as new', () => {
    component.myUser = {
      Notifications: [
        {
          New: false,
          Message: 'Notification 1',
          Date: new Date().getTime(),
          SenderId: '1',
        },
        {
          New: false,
          Message: 'Notification 2',
          Date: new Date().getTime(),
          SenderId: '2',
        },
      ],
    };

    component.getNewNotifications();

    expect(component.newNotifications).toEqual([]);
  });

  it('should log out', async () => {
    spyOn(authService, 'SignOut').and.callThrough();

    await component.logOut();

    expect(userService.updateUser).toHaveBeenCalledWith(null);
    expect(authService.SignOut).toHaveBeenCalled();
  });
});
