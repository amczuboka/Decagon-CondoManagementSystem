import { Component } from '@angular/core';
import { User } from 'firebase/auth';
import { Subscription } from 'rxjs';
import {
  Authority,
  CompanyDTO,
  EmployeeDTO,
  Notification,
  UserDTO,
} from 'src/app/models/users';
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
        this.getNewNotifications();
      }
    });
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
