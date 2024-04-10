import { Component, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { Navlinks, linkAuthority } from 'src/app/models/properties';
import { Authority, Notification } from 'src/app/models/users';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
/**
 * HeaderComponent is a component that provides a header for the application.
 * It includes navigation links and user information.
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  authority: string = Authority.Public; // The authority level of the current user
  myUser!: any; // The current user
  newNotifications: Notification[] = []; // New notifications for the current user
  userSubscription: Subscription = new Subscription(); // Subscription to the current user
  links: Navlinks[] = []; // Navigation links
  biglinks: Navlinks[] = []; // Navigation links for large screens
  smalllinks: Navlinks[] = []; // Navigation links for small screens

  /**
   * Constructor for HeaderComponent.
   * @param authService - Service for authentication-related operations
   * @param userService - Service for user-related operations
   */
  constructor(
    public authService: AuthService,
    public userService: UserService
  ) {}

  /**
   * ngOnInit is a lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   */
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

  /**
   * Event listener for window resize events.
   * @param event - The resize event
   */
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updateMyObject(event.target.innerWidth);
  }

  /**
   * Updates the navigation links based on the window width.
   * @param windowWidth - The current window width
   */
  updateMyObject(windowWidth: number) {
    //set links
    this.links = [
      { label: 'Profile', path: 'user-profile', authority: linkAuthority.Any },
      { label: 'Home', path: '', authority: linkAuthority.Any },
      {
        label: 'My Properties',
        path: 'my-properties',
        authority: linkAuthority.Company,
      },
      {
        label: 'My Properties',
        path: 'my-properties',
        authority: linkAuthority.Public,
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
      {
        label: 'Key Registration',
        path: 'key-registration',
        authority: linkAuthority.Public,
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

  /**
   * Fetches new notifications for the current user.
   */
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

  /**
   * Logs out the current user.
   */
  async logOut() {
    this.userService.updateUser(null);
    await this.authService.SignOut();
  }
}
