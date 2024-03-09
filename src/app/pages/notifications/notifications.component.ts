import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { DeleteNotificationDialogComponent } from 'src/app/pages/notifications/delete-notification-dialog/delete-notification-dialog.component';
import { CompanyDTO, EmployeeDTO, UserDTO } from 'src/app/models/users';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent {
  authority!: string;
  myUser!: any;
  loading!: boolean;
  displayedColumns: string[] = ['message', 'date', 'sender', 'actions']; // Updated column name to 'sender'
  dataSource: any = [];
  userSubscription: Subscription = new Subscription();

  constructor(
    public authService: AuthService,
    public userService: UserService,
    public dialog: MatDialog
  ) {}

  async ngOnInit() {
    this.userSubscription = this.userService.myUser.subscribe((user) => {
      this.myUser = user;
      if (this.myUser) {
        this.dataSource = this.myUser.Notifications.sort((a: any, b: any) => {
          const dateA = new Date(a.Date).getTime();
          const dateB = new Date(b.Date).getTime();
          return dateB - dateA;
        });
        this.fetchSenderNames();
      }
    });
  }

  async fetchSenderNames() {
    // this.loading = true;
    for (const notification of this.dataSource) {
      const senderId = notification.SenderId;
      let senderName = '';
      let user: UserDTO | CompanyDTO | EmployeeDTO | null = null;

      // Search in public users
      user = await this.userService.getPublicUser(senderId);
      if (user) {
        senderName = `${user.FirstName} ${user.LastName}`;
      } else {
        // Search in company users
        user = await this.userService.getCompanyUser(senderId);
        if (user) {
          senderName = `${user.FirstName} ${user.LastName}`;
        } else {
          // Search in employee users
          user = await this.userService.getEmployeeUser(senderId);
          if (user) {
            senderName = `${user.FirstName} ${user.LastName}`;
          } else {
            senderName = 'Unknown';
          }
        }
      }

      notification.SenderId = senderName;
    }
    // this.loading = false;
  }

  markAsRead(notification: any) {
    notification.New = false;
    this.myUser.Notifications = this.myUser.Notifications.map((n: any) =>
      n.Message === notification.Message &&
      n.New === notification.New &&
      n.Date === notification.Date &&
      n.SenderId === notification.SenderId
        ? notification
        : n
    );
    this.userService.editUser(this.myUser.ID, this.myUser);
  }

  markAsUnread(notification: any) {
    notification.New = true;
    this.myUser.Notifications = this.myUser.Notifications.map((n: any) =>
      n.Message === notification.Message &&
      n.New === notification.New &&
      n.Date === notification.Date &&
      n.SenderId === notification.SenderId
        ? notification
        : n
    );
    this.userService.editUser(this.myUser.ID, this.myUser);
  }

  deleteNotification(notification: any) {
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
}
