import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  Authority,
  Notification,
} from 'src/app/models/users';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  authority: string = Authority.Public;
  myUser!: any;
  newNotifications: Notification[] = [];
  userSubscription: Subscription = new Subscription();

  constructor(
    public authService: AuthService,
    public userService: UserService
  ) {}

  async ngOnInit() {
    this.userSubscription = this.userService.myUser.subscribe((user) => {
      this.myUser = user;
      if (this.myUser) {
        this.authority = this.myUser.Authority;
        this.getNewNotifications();
      }
    });
  }

  getNewNotifications() {
    this.newNotifications = [];
    if (this.myUser.Notifications) {
      for (const notification of this.myUser.Notifications) {
        if (notification.New) {
          this.newNotifications.push(notification);
        }
      }
    }
  }

  async logOut() {
    this.userService.updateUser(null);
    await this.authService.SignOut();
  }
}
