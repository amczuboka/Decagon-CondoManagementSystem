import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { DeleteNotificationDialogComponent } from 'src/app/pages/notifications/delete-notification-dialog/delete-notification-dialog.component';
import {
  Authority,
  Notification,
  RequestStatus,
  NotificationType,
} from 'src/app/models/users';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { NotificationService } from 'src/app/services/notification.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent {
  authority: string = Authority.Public;
  myUser!: any;
  loading!: boolean;
  displayedColumns: string[] = [
    'type',
    'status',
    'message',
    'date',
    'sender',
    'actions',
  ];
  requestStatusArray = Object.values(RequestStatus);
  dataSource: any = [];
  userSubscription: Subscription = new Subscription();
  NotificationType = NotificationType;

  constructor(
    public authService: AuthService,
    public userService: UserService,
    public dialog: MatDialog,
    public notificationService: NotificationService
  ) {}

  async ngOnInit() {
    this.userSubscription = this.userService.myUser.subscribe((user) => {
      this.myUser = user;
      if (this.myUser) {
        this.authority = this.myUser.Authority;
        if (this.myUser.Notifications) {
          this.dataSource = this.myUser.Notifications.sort((a: any, b: any) => {
            const dateA = new Date(a.Date).getTime();
            const dateB = new Date(b.Date).getTime();
            return dateB - dateA;
          });
        } else {
          this.dataSource = [];
        }
      }
    });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  markAsRead(notification: Notification) {
    notification.New = false;
    this.myUser.Notifications = this.myUser.Notifications.map((n: any) =>
      n.Message === notification.Message &&
      n.New === notification.New &&
      n.Date === notification.Date &&
      n.Type === notification.Type &&
      n.SenderId === notification.SenderId
        ? notification
        : n
    );
    this.userService.editUser(this.myUser.ID, this.myUser);
  }

  markAsUnread(notification: Notification) {
    notification.New = true;
    this.myUser.Notifications = this.myUser.Notifications.map((n: any) =>
      n.Message === notification.Message &&
      n.New === notification.New &&
      n.Date === notification.Date &&
      n.Type === notification.Type &&
      n.SenderId === notification.SenderId
        ? notification
        : n
    );
    this.userService.editUser(this.myUser.ID, this.myUser);
  }

  deleteNotification(notification: Notification) {
    const dialogRef = this.dialog.open(DeleteNotificationDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.myUser.Notifications = this.myUser.Notifications.filter(
          (n: any) =>
            n.Message !== notification.Message ||
            n.New !== notification.New ||
            n.Date !== notification.Date ||
            n.SenderId !== notification.SenderId
        );
        this.userService.editUser(this.myUser.ID, this.myUser);
      }
    });
  }

  async sendNotificationUpdatingStatus(notification: Notification) {
    this.myUser.Notifications = this.myUser.Notifications.map((n: any) => {
      if (
        n.Message === notification.Message &&
        n.New === notification.New &&
        n.Date === notification.Date &&
        n.SenderId === notification.SenderId
      ) {
        return { ...n, Status: notification.Status };
      } else {
        return n;
      }
    });
    this.userService.editUser(this.myUser.ID, this.myUser);
    const myNotification = {
      Message: `Request status updated to "${
        notification.Status
      }" for request: ${
        notification.Type === NotificationType.RentRequest ||
        notification.Type === NotificationType.OwnershipRequest
          ? notification.Status !== RequestStatus.Approved
            ? notification.Message.replace(/\s*with ID \w+$/, '')
            : notification.Message
          : notification.Message
      }`,
      New: true,
      Date: Date.now(),
      SenderId: this.myUser.ID,
      SenderName: this.myUser.CompanyName,
      Type: NotificationType.GeneralMessage,
    };
    await this.userService.sendNotificationToUser(
      notification.SenderId,
      Authority.Public,
      myNotification
    );
  }

  async acceptRequest(notification: Notification) {
    const splitMessage = notification.Message.split(' ');
    const registrationKey = splitMessage[splitMessage.length - 1];
    const shortMessage = splitMessage
      .slice(1, splitMessage.length - 3)
      .join(' ');
    const myNotification = {
      Message: `Request accepted ${shortMessage}. Please go to the registration page and enter the key to complete the registration process. Here is your registration key: ${registrationKey}`,
      New: true,
      Date: Date.now(),
      SenderId: this.myUser.ID,
      SenderName: this.myUser.CompanyName,
      Type: NotificationType.GeneralMessage,
    };
    await this.userService.sendNotificationToUser(
      notification.SenderId,
      Authority.Public,
      myNotification
    );
    this.markAsRead(notification);
    this.myUser.Notifications = this.myUser.Notifications.map((n: any) => {
      if (
        n.Message === notification.Message &&
        n.New === notification.New &&
        n.Date === notification.Date &&
        n.SenderId === notification.SenderId
      ) {
        return { ...n, Status: RequestStatus.Approved };
      } else {
        return n;
      }
    });
    this.userService.editUser(this.myUser.ID, this.myUser);
    this.notificationService.sendNotification(
      `Request accepted. Registration key sent to ${notification.SenderName}`
    );
  }
}
