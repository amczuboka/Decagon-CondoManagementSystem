import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationsComponent } from './notifications.component';
import { AppModule } from 'src/app/app.module';
import {
  Authority,
  CompanyDTO,
  EmployeeDTO,
  Notification,
  Role,
  UserDTO,
} from 'src/app/models/users';
import { MatDialog } from '@angular/material/dialog';
import { DeleteNotificationDialogComponent } from 'src/app/components/delete-notification-dialog/delete-notification-dialog.component';
import { of } from 'rxjs';

// Call this function to create notifications
function createNotifications(count: number): Notification[] {
  const notifications: Notification[] = [];
  for (let i = 0; i < count; i++) {
    notifications.push({
      Message: `test${i}`,
      New: true,
      Date: new Date().getTime(),
      SenderId: `${i}`,
    });
  }
  return notifications;
}

describe('NotificationsComponent', () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;

  let mockDialogRef = {
    close: jasmine.createSpy('close'),
  };

  let mockDialog = {
    open: jasmine.createSpy('open').and.returnValue(mockDialogRef),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [NotificationsComponent, DeleteNotificationDialogComponent],
      providers: [{ provide: MatDialog, useValue: mockDialog }],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark notification as read', () => {
    const notification: Notification = {
      Message: 'test',
      New: true,
      Date: new Date().getTime(),
      SenderId: '1',
    };
    component.myUser = { Notifications: [notification] };
    spyOn(component.userService, 'editUser');
    component.markAsRead(notification);
    expect(notification.New).toBe(false);
    expect(component.myUser.Notifications).toEqual([
      { Message: 'test', New: false, Date: notification.Date, SenderId: '1' },
    ]);
    expect(component.userService.editUser).toHaveBeenCalledWith(
      component.myUser.ID,
      component.myUser
    );
  });

  it('should mark notification as unread', () => {
    const notification = {
      Message: 'test',
      New: false,
      Date: new Date().getTime(),
      SenderId: '1',
    };
    component.myUser = { Notifications: [notification] };
    spyOn(component.userService, 'editUser');
    component.markAsUnread(notification);
    expect(notification.New).toBe(true);
    expect(component.myUser.Notifications).toEqual([
      { Message: 'test', New: true, Date: notification.Date, SenderId: '1' },
    ]);
    expect(component.userService.editUser).toHaveBeenCalledWith(
      component.myUser.ID,
      component.myUser
    );
  });

  it('should delete notification when confirmed', () => {
    const notification: Notification = {
      Message: 'test',
      New: true,
      Date: new Date().getTime(),
      SenderId: '1',
    };
    component.myUser = { Notifications: [notification] };
    spyOn(component.userService, 'editUser');
    (component.dialog.open as jasmine.Spy).and.returnValue({
      afterClosed: () => of(true),
    } as any);

    component.deleteNotification(notification);

    expect(component.myUser.Notifications).toEqual([] as any); // Cast to any to fix type error
    expect(component.userService.editUser).toHaveBeenCalledWith(
      component.myUser.ID,
      component.myUser
    );
  });

  it('should not delete notification when not confirmed', () => {
    const notification: Notification = {
      Message: 'test',
      New: true,
      Date: new Date().getTime(),
      SenderId: '1',
    };
    component.myUser = { Notifications: [notification] };
    spyOn(component.userService, 'editUser');
    (component.dialog.open as jasmine.Spy).and.returnValue({
      afterClosed: () => of(false),
    } as any);

    component.deleteNotification(notification);

    expect(component.myUser.Notifications).toEqual([notification]);
    expect(component.userService.editUser).not.toHaveBeenCalled();
  });

  it('should fetch sender names', async () => {
    const notifications = createNotifications(3);
    component.dataSource = notifications.map((n) => ({
      ...n,
      SenderId: n.SenderId,
    }));

    const user1: UserDTO = {
      FirstName: 'John',
      LastName: 'Doe',
      ID: '1',
      Authority: Authority.Public,
      Email: '',
      ProfilePicture: '',
      PhoneNumber: '',
      UserName: '',
    };
    const user2: CompanyDTO = {
      FirstName: 'Jane',
      LastName: 'Smith',
      ID: '2',
      Authority: Authority.Company,
      Email: '',
      ProfilePicture: '',
      PhoneNumber: '',
      UserName: '',
      CompanyName: '',
      PropertyIds: [],
      EmployeeIds: [],
    };
    const user3: EmployeeDTO = {
      FirstName: 'Bob',
      LastName: 'Johnson',
      ID: '3',
      Authority: Authority.Employee,
      Email: '',
      ProfilePicture: '',
      PhoneNumber: '',
      UserName: '',
      CompanyName: '',
      PropertyIds: [],
      Role: Role.None,
    };

    spyOn(component.userService, 'getPublicUser').and.returnValues(
      Promise.resolve(user1),
      Promise.resolve(null)
    );
    spyOn(component.userService, 'getCompanyUser').and.returnValues(
      Promise.resolve(user2),
      Promise.resolve(null)
    );
    spyOn(component.userService, 'getEmployeeUser').and.returnValues(
      Promise.resolve(user3),
      Promise.resolve(null),
      Promise.resolve(null)
    );

    await component.fetchSenderNames();

    expect(component.dataSource[0].SenderId).toBe('John Doe');
    expect(component.dataSource[1].SenderId).toBe('Jane Smith');
    expect(component.dataSource[2].SenderId).toBe('Bob Johnson');
  });

  it('should initialize component', () => {
    const userServiceSpy = spyOn(
      component.userService['myUserSubject'],
      'next'
    ).and.callThrough();
    const myUser: EmployeeDTO = {
      FirstName: 'John',
      LastName: 'Doe',
      ID: '1',
      Authority: Authority.Employee,
      Email: '',
      ProfilePicture: '',
      PhoneNumber: '',
      UserName: '',
      CompanyName: '',
      PropertyIds: [],
      Role: Role.None,
      Notifications: createNotifications(3),
    };
    component.userService.updateUser(myUser);

    spyOn(component, 'fetchSenderNames').and.callThrough();

    component.ngOnInit();

    expect(userServiceSpy).toHaveBeenCalledWith(myUser);
    expect(component.dataSource).toEqual(myUser.Notifications);
    expect(component.fetchSenderNames).toHaveBeenCalled();
  });
});
