import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { Booking, Building } from 'src/app/models/properties';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { BookingsService } from 'src/app/services/bookings.service';
import { NotificationService } from 'src/app/services/notification.service';
import { BuildingService } from 'src/app/services/building.service';

@Component({
  selector: 'app-booking-card',
  templateUrl: './booking-card.component.html',
  styleUrls: ['./booking-card.component.scss'],
})
export class BookingCardComponent {
  @Input() building!: Building;

  myUser!: any;
  userSubscription: Subscription = new Subscription();
  myBookings: Booking[] = [];
  /**
   *
   * @param userService
   * @param authService
   * @param bookingsService
   * @param notificationService
   */
  constructor(
    public userService: UserService,
    public authService: AuthService,
    public bookingsService: BookingsService,
    public notificationService: NotificationService,
    public buildingService: BuildingService
  ) {}

  async ngOnInit() {
    //Subscribe to the building with the building.ID for real time updates

    this.buildingService.subscribeToBuildingById(this.building?.ID).subscribe({
      next: async (Building: Building | null) => {
        if (Building) {
          this.myUser = await this.authService.getUser();
          this.userService.subscribeToPublicUser(this.myUser?.uid, (user) => {
            this.myUser = user;
            this.myBookings = Building.Bookings?.filter(
              (booking: Booking) => booking.OccupantID === this.myUser.ID
            );
          });
        }
      },
    });
  }

  /**
   *
   * @param bookingID
   */
  async deleteBooking(bookingID: string) {
    const buildingID = this.building.ID;
    await this.bookingsService.removeBooking(buildingID, bookingID);
    this.notificationService.sendNotification('Booking successfully deleted!');
  }
}
