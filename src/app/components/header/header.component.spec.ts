import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { AppModule } from 'src/app/app.module';
import { AuthService } from 'src/app/services/auth.service';
import { of } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { NotificationType } from 'src/app/models/users';
import { linkAuthority } from 'src/app/models/properties';

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
    let date = new Date().getTime();
    let trimmedDate = Number(date.toString().substring(0, 11));
    component.myUser = {
      Notifications: [
        {
          New: true,
          Message: 'Notification 1',
          Date: trimmedDate,
          SenderId: '1',
          SenderName: 'test1',
          Type: NotificationType.GeneralMessage,
        },
        {
          New: false,
          Message: 'Notification 2',
          Date: trimmedDate,
          SenderId: '2',
          SenderName: 'test2',
          Type: NotificationType.GeneralMessage,
        },
        {
          New: true,
          Message: 'Notification 3',
          Date: trimmedDate,
          SenderId: '3',
          SenderName: 'test3',
          Type: NotificationType.GeneralMessage,
        },
      ],
    };

    component.getNewNotifications();

    expect(component.newNotifications).toEqual([
      {
        New: true,
        Message: 'Notification 1',
        Date: trimmedDate,
        SenderId: '1',
        SenderName: 'test1',
        Type: NotificationType.GeneralMessage,
      },
      {
        New: true,
        Message: 'Notification 3',
        Date: trimmedDate,
        SenderId: '3',
        SenderName: 'test3',
        Type: NotificationType.GeneralMessage,
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
    let date = new Date().getTime();
    let trimmedDate = Number(date.toString().substring(0, 11));
    component.myUser = {
      Notifications: [
        {
          New: false,
          Message: 'Notification 1',
          Date: trimmedDate,
          SenderId: '1',
          SenderName: 'test1',
          Type: NotificationType.GeneralMessage,
        },
        {
          New: false,
          Message: 'Notification 2',
          Date: trimmedDate,
          SenderId: '2',
          SenderName: 'test2',
          Type: NotificationType.GeneralMessage,
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

  it('should update myObject for small screens', () => {
    // Arrange
    const windowWidth = 500;

    // Act
    component.updateMyObject(windowWidth);

    // Assert
    expect(component.biglinks).toEqual([]);
    expect(component.smalllinks).toEqual(component.links);
  });

  it('should update myObject for large screens', () => {
    // Arrange
    const windowWidth = 800;

    // Act
    component.updateMyObject(windowWidth);

    // Assert
    expect(component.smalllinks).toEqual([
      { label: 'Profile', path: 'user-profile', authority: linkAuthority.Any },
      { label: 'Log Out', path: 'out', authority: linkAuthority.Any },
    ]);
    expect(component.biglinks).not.toBe([]);
  });

});
