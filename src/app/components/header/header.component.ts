import { Component } from '@angular/core';
import { User } from 'firebase/auth';
import { Subscription } from 'rxjs';
import { Authority, Notification } from 'src/app/models/users';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  authority!: string;
  myUser!: any;
  private subscription!: Subscription;
  newNotifications: Notification[] = [];

  constructor(
    public authService: AuthService,
    public userService: UserService
  ) {}

  async ngOnInit() {
    await this.getUserData();
  }

  async getUserData() {
    this.myUser = this.authService.getUser() as User;
    if (this.myUser) {
      if (this.myUser.photoURL == Authority.Company) {
        this.userService.subscribeToCompanyUser(this.myUser.uid, (user) => {
          this.myUser = user;
          this.getNewNotifications();
        });
      } else if (this.myUser.photoURL == Authority.Employee) {
        this.userService.subscribeToEmployeeUser(this.myUser.uid, (user) => {
          this.myUser = user;
          this.getNewNotifications();
        });
      } else {
        this.userService.subscribeToPublicUser(this.myUser.uid, (user) => {
          this.myUser = user;
          this.getNewNotifications();
        });
      }
    }
  }

  getNewNotifications() {
    if (this.myUser.Notifications) {
      this.newNotifications = [];
      for (const notification of this.myUser.Notifications) {
        if (notification.New) {
          this.newNotifications.push(notification);
        }
      }
    }
  }
}
