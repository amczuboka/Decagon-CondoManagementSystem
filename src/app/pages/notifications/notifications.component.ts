import { Component } from '@angular/core';
import { Authority, User } from 'src/app/models/users';
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
  displayedColumns: string[] = [];
  dataSource: any = [];

  constructor(
    public authService: AuthService,
    public userService: UserService
  ) {
    this.updateDisplayedColumns();
    window.addEventListener('resize', () => {
      this.updateDisplayedColumns();
    });
  }

  updateDisplayedColumns() {
    if (window.innerWidth <= 700) {
      this.displayedColumns = ['message', 'date', 'actions'];
    } else {
      this.displayedColumns = ['message', 'date', 'SenderId', 'actions'];
    }
  }

  async ngOnInit() {
    await this.getUserData();
  }

  async getUserData(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.myUser = this.authService.getUser() as User;
      if (this.myUser) {
        const callback = (user: any) => {
          this.myUser = user;
          this.dataSource = this.myUser.Notifications.sort((a: any, b: any) => {
            const dateA = new Date(a.Date).getTime();
            const dateB = new Date(b.Date).getTime();
            return dateB - dateA;
          });
          resolve();
        };

        if (this.myUser.photoURL == Authority.Company) {
          this.userService.subscribeToCompanyUser(this.myUser.uid, callback);
        } else if (this.myUser.photoURL == Authority.Employee) {
          this.userService.subscribeToEmployeeUser(this.myUser.uid, callback);
        } else {
          this.userService.subscribeToPublicUser(this.myUser.uid, callback);
        }
      } else {
        resolve();
      }
    });
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
    this.myUser.Notifications = this.myUser.Notifications.filter(
      (n: any) =>
        n.Message !== notification.Message ||
        n.New !== notification.New ||
        n.Date !== notification.Date ||
        n.SenderId !== notification.SenderId
    );
    this.userService.editUser(this.myUser.ID, this.myUser);
  }
}
