import { Component, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { Navlinks, linkAuthority } from 'src/app/models/properties';
import { Authority, Notification } from 'src/app/models/users';
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
  links: Navlinks[] = [];
  biglinks: Navlinks[] = [];
  smalllinks: Navlinks[] = [];

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
    this.updateMyObject(window.innerWidth);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updateMyObject(event.target.innerWidth);
  }
  updateMyObject(windowWidth: number) {
    this.links = [
      { label: 'Profile', path: 'user-profile', authority: linkAuthority.Any },
      { label: 'Home', path: '', authority: linkAuthority.Any },
      {
        label: 'My Properties',
        path: 'my-properties',
        authority: linkAuthority.Any,
      },
      {
        label: 'Add New Property',
        path: 'add-property',
        authority: linkAuthority.Company,
      },
      {
        label: 'Add New Operation',
        path: 'add-operation',
        authority: linkAuthority.Company,
      },
      { label: 'Log Out', path: 'out', authority: linkAuthority.Any },
    ];
    this.biglinks = this.links;
    this.smalllinks = this.links;
    if (windowWidth < 768) {
      // Update myObject for small screens
      this.biglinks = [];

      console.log('small screen');
    } else {
      // Update myObject for large screens
      this.biglinks = this.biglinks.filter((slot) => slot.label !== 'Profile');
      this.biglinks = this.biglinks.filter((slot) => slot.label !== 'Log Out');
      this.smalllinks = this.smalllinks.filter(
        (slot) => slot.label == 'Profile' || slot.label == 'Log Out'
      );
      console.log('large screen');
    }

    console.log('windowWidth', windowWidth);
    console.log('biglinks', this.biglinks);
    console.log('smalllinks', this.smalllinks);
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
