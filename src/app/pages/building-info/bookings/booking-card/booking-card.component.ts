import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Booking } from 'src/app/models/properties';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-booking-card',
  templateUrl: './booking-card.component.html',
  styleUrls: ['./booking-card.component.scss'],
})
export class BookingCardComponent {
  myUser!: any;
  userSubscription: Subscription = new Subscription();
  myBookings: Booking[] = [];

  constructor(public userService: UserService, public authService: AuthService) {}

  async ngOnInit() {
    this.myUser = await this.authService.getUser();
    if (this.myUser) {
      this.userService.subscribeToPublicUser(this.myUser.uid, (user) => {
        this.myUser = user;
        if (this.myUser) {
          if (this.myUser.Bookings) this.myBookings = this.myUser.Bookings;
        }
      });
    }
  }
}
