import { Component, Input } from '@angular/core';
import { Condo, Building } from 'src/app/models/properties';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import {
  Authority,
  Notification,
  NotificationType,
} from 'src/app/models/users';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-condo',
  templateUrl: './condo.component.html',
  styleUrls: ['./condo.component.scss'],
})
export class CondoComponent {
  @Input() condos!: Condo[];
  @Input() building!: Building;
  @Input() sourcePage!: string;
  @Input() address!: string;
  myUser!: any;
  authority!: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    public userService: UserService,
    public notificationService: NotificationService
  ) {}

  async requestOwnership(item: Condo) {
    // Create a new notification
    const notification: Notification = {
      Date: new Date().getTime(),
      Message: `Request for ownership of unit ${item.UnitNumber} in ${this.building.Name} with ID ${item.ID}`,
      New: true,
      SenderId: this.myUser.ID,
      SenderName: `${this.myUser.FirstName} ${this.myUser.LastName}`,
      Type: NotificationType.OwnershipRequest,
    };
    await this.userService.sendNotificationToUser(
      this.building.CompanyID,
      Authority.Company,
      notification
    );
    this.notificationService.sendNotification(
      'Your request for ownership has been sent. You will be notified when it is approved.'
    );
  }

  async requestRent(item: Condo) {
    // Create a new notification
    const notification: Notification = {
      Date: new Date().getTime(),
      Message: `Request for rental of unit ${item.UnitNumber} in ${this.building.Name} with ID ${item.ID}`,
      New: true,
      SenderId: this.myUser.ID,
      SenderName: `${this.myUser.FirstName} ${this.myUser.LastName}`,
      Type: NotificationType.RentRequest,
    };
    await this.userService.sendNotificationToUser(
      this.building.CompanyID,
      Authority.Company,
      notification
    );
    this.notificationService.sendNotification(
      'Your request for rental has been sent. You will be notified when it is approved.'
    );
  }

  async ngOnInit() {
    // Fetch the current user
    try {
      this.myUser = await this.authService.getUser();
      if (this.myUser) {
        this.authority = this.myUser.photoURL;
        if (this.authority == Authority.Public) {
          this.userService.getPublicUser(this.myUser.uid).then((user) => {
            this.myUser = user;
          });
        } else if (this.authority == Authority.Employee) {
          this.userService.getEmployeeUser(this.myUser.uid).then((user) => {
            this.myUser = user;
          });
        } else if (this.authority == Authority.Company) {
          this.userService.getCompanyUser(this.myUser.uid).then((user) => {
            this.myUser = user;
          });
        }
      } else {
        this.authority = '';
      }
    } catch (error) {
      console.error(error);
      this.authority = '';
    }
  }
}
