import { Component } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Booking, Building } from 'src/app/models/properties';
import { UserDTO } from 'src/app/models/users';
import { AuthService } from 'src/app/services/auth.service';
import { BuildingService } from 'src/app/services/building.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-booking-card',
  templateUrl: './booking-card.component.html',
  styleUrls: ['./booking-card.component.scss']
})
export class BookingCardComponent {
  user!: UserDTO;
  userSubscription: Subscription = new Subscription();
  buildingObj!: Building;
  myBookings!: Booking[] | undefined;

  constructor(
    private buildingService: BuildingService,
    private authService: AuthService,
    public userService: UserService
  ) {}

  async ngOnInit(){
  
    this.userSubscription = this.userService.myUser.subscribe((user) =>{
      this.user = user;
      this.myBookings = user?.Bookings;
    });
    // //Getting user
    // const currentUser = this.authService.getUser(); // Get the current authenticated user
    // const user = await this.userService.getPublicUser(currentUser.uid);
    

  }


  

}
