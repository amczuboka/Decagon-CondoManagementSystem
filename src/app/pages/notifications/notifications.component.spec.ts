import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationsComponent } from './notifications.component';
import { AppModule } from 'src/app/app.module';
import { Notification } from 'src/app/models/users';
import { MatDialog } from '@angular/material/dialog';
import { DeleteNotificationDialogComponent } from 'src/app/components/delete-notification-dialog/delete-notification-dialog.component';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription, of } from 'rxjs';

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

  it('should call getUserData after subscribing to currentUser$', async () => {
    const mockUser = { firstName: 'John', lastName: 'Doe' };
    const mockSubscription = new Subscription();
    spyOn(component.userService.currentUser$, 'subscribe').and.callFake(
      (observerOrNext) => {
        if (typeof observerOrNext === 'function') {
          observerOrNext(mockUser);
        } else if (
          observerOrNext &&
          typeof observerOrNext.next === 'function'
        ) {
          observerOrNext.next(mockUser);
        }
        return mockSubscription;
      }
    );
    spyOn(component, 'getUserData');

    await component.ngOnInit();

    expect(component.getUserData).toHaveBeenCalled();
  });

  it('should call getUserData after subscribing to currentUser$', async () => {
    const mockSubscription = new Subscription();
    spyOn(component.userService.currentUser$, 'subscribe').and.returnValue(
      mockSubscription
    );
    spyOn(component, 'getUserData');

    await component.ngOnInit();

    expect(component.getUserData).toHaveBeenCalled();
  });

  it('should mark notification as read', () => {
    const notification: Notification = {
      Message: 'test',
      New: true,
      Date: new Date(),
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
      Date: new Date(),
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
      Date: new Date(),
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
      Date: new Date(),
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
});
