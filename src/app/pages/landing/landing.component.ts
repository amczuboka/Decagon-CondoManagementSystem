import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Authority, User } from 'src/app/models/users';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent {
  myUser: any;
  userSubscription: Subscription = new Subscription();

  constructor(private userService: UserService) {}

  async onInit() {
    this.userSubscription = this.userService.myUser.subscribe((user) => {
      this.myUser = user;
    });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
