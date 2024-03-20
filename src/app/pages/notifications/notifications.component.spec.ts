import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationsComponent } from './notifications.component';
import { AppModule } from 'src/app/app.module';
import {
  Authority,
  EmployeeDTO,
  Notification,
  NotificationType,
  Role,
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
      SenderName: `test${i}`,
      Type: NotificationType.Default,
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

  it('should unsubscribe from userSubscription on ngOnDestroy', () => {
    spyOn(component.userSubscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.userSubscription.unsubscribe).toHaveBeenCalled();
  });

  it('should mark notification as read', () => {
    const notification: Notification = {
      Message: 'test',
      New: true,
      Date: new Date().getTime(),
      SenderId: '1',
      SenderName: 'test',
      Type: NotificationType.Default,
    };
    component.myUser = { Notifications: [notification] };
    spyOn(component.userService, 'editUser');
    component.markAsRead(notification);
    expect(notification.New).toBe(false);
    expect(component.myUser.Notifications).toEqual([
      {
        Message: 'test',
        New: false,
        Date: notification.Date,
        SenderId: '1',
        SenderName: 'test',
        Type: NotificationType.Default,
      },
    ]);
    expect(component.userService.editUser).toHaveBeenCalledWith(
      component.myUser.ID,
      component.myUser
    );
  });

  it('should mark notification as unread', () => {
    const notification: Notification = {
      Message: 'test',
      New: false,
      Date: new Date().getTime(),
      SenderId: '1',
      SenderName: 'test',
      Type: NotificationType.Default,
    };
    component.myUser = { Notifications: [notification] };
    spyOn(component.userService, 'editUser');
    component.markAsUnread(notification);
    expect(notification.New).toBe(true);
    expect(component.myUser.Notifications).toEqual([
      {
        Message: 'test',
        New: true,
        Date: notification.Date,
        SenderId: '1',
        SenderName: 'test',
        Type: NotificationType.Default,
      },
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
      SenderName: 'test',
      Type: NotificationType.Default,
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
      SenderName: 'test',
      Type: NotificationType.Default,
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

  it('should accept request and send notification', async () => {
    const notification: Notification = {
      Message:
        'Request for rental of unit 1E-0-1 in Majestic hotel with ID tqdya2o0n9d1709505373223',
      New: true,
      Date: new Date().getTime(),
      SenderId: '1',
      SenderName: 'test',
      Type: NotificationType.Default,
    };

    component.myUser = {
      FirstName: 'John',
      LastName: 'Doe',
      ID: '1',
      Authority: Authority.Company,
      Email: '',
      ProfilePicture: '',
      PhoneNumber: '',
      UserName: '',
      CompanyName: 'test',
      PropertyIds: [],
      EmployeeIds: [],
      Notifications: [notification],
    };

    const userServiceSpy = spyOn(
      component.userService,
      'sendNotificationToUser'
    ).and.returnValue(Promise.resolve());
    const markAsReadSpy = spyOn(component, 'markAsRead');
    const notificationServiceSpy = spyOn(
      component.notificationService,
      'sendNotification'
    );

    await component.acceptRequest(notification);

    // Check if the message was correctly processed
    const expectedMessage =
      'Request accepted for rental of unit 1E-0-1 in Majestic hotel. Please go to the registration page and enter the key to complete the registration process. Here is your registration key: tqdya2o0n9d1709505373223';
    expect(userServiceSpy.calls.mostRecent().args[2].Message).toEqual(
      expectedMessage
    );

    expect(markAsReadSpy).toHaveBeenCalledWith(notification);
    expect(notificationServiceSpy).toHaveBeenCalledWith(
      'Request accepted. Registration key sent to test'
    );
  });
});
