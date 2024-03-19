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
import { DeleteNotificationDialogComponent } from 'src/app/pages/notifications/delete-notification-dialog/delete-notification-dialog.component';
import { of } from 'rxjs';

// Call this function to create notifications based on the count
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

    component.ngOnInit();

    expect(userServiceSpy).toHaveBeenCalledWith(myUser);
    expect(component.dataSource).toEqual(myUser.Notifications);
  });
});
