import { Component } from '@angular/core';
import { User } from 'firebase/auth';
import { Subscription } from 'rxjs';
import { Authority } from 'src/app/models/users';
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

  constructor(
    public authService: AuthService,
    public userService: UserService
  ) {}

  async ngOnInit() {
    this.subscription = this.userService.currentUser$.subscribe((user) => {
      if (user) {
        this.myUser = user;
      }
    });
    await this.getUserData();
  }

  async getUserData() {
    this.myUser = this.authService.getUser() as User;
    if (this.myUser) {
      if (this.myUser.photoURL == Authority.Company) {
        this.myUser = await this.userService.getCompanyUser(this.myUser.uid);
      } else if (this.myUser.photoURL == Authority.Employee) {
        this.myUser = await this.userService.getPublicUser(this.myUser.uid);
      } else {
        this.myUser = await this.userService.getPublicUser(this.myUser.uid);
      }
    }
  }
}
