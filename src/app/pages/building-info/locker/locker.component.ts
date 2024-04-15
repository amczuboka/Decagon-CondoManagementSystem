import { Component, Input, SimpleChanges } from '@angular/core';
import { Building, Locker } from 'src/app/models/properties';
import {
  Authority,
  Notification,
  NotificationType,
  RequestStatus,
  UserDTO,
} from 'src/app/models/users';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-locker',
  templateUrl: './locker.component.html',
  styleUrls: ['./locker.component.scss'],
})
export class LockerComponent {
  authority!: string;
  users: { [key: string]: UserDTO } = {};
  myUser!: any;
  @Input() lockers!: Locker[];
  @Input() sourcePage!: string;
  @Input() building!: Building;

  constructor(
    private authService: AuthService,
    public userService: UserService,
    public notificationService: NotificationService
  ) {}

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['lockers']?.currentValue) {
      // Fetch user information for each locker's occupant
      for (const locker of this.lockers) {
        if (locker.OccupantID) {
          try {
            const user = await this.userService.getPublicUser(
              locker.OccupantID
            );
            if (user) {
              this.users[locker.OccupantID] = user;
            }
          } catch (error) {
            console.error('Failed to get user', error);
          }
        }
      }
    }
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

  async requestRent(item: Locker) {
    // Create a new notification
    const notification: Notification = {
      Date: new Date().getTime(),
      Message: `Request for rental of locker ${item.Number} in ${this.building.Name} with ID ${item.ID}`,
      New: true,
      SenderId: this.myUser.ID,
      SenderName: `${this.myUser.FirstName} ${this.myUser.LastName}`,
      Type: NotificationType.RentRequest,
      Status: RequestStatus.Pending,
    };
    await this.userService.sendNotificationToEmployeeOfCompany(
      this.building.CompanyID,
      this.building.ID,
      notification
    );
    this.notificationService.sendNotification(
      'Your request for rental has been sent. You will be notified when it is approved.'
    );
  }
}
