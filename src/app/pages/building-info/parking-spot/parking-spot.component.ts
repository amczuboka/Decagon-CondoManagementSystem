import { Component, Input, SimpleChanges } from '@angular/core';
import {
  ParkingSpot,
} from 'src/app/models/properties';
import { UserDTO } from 'src/app/models/users';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-parking-spot',
  templateUrl: './parking-spot.component.html',
  styleUrls: ['./parking-spot.component.scss'],
})
export class ParkingSpotComponent {
  authority!: string;
  users: { [key: string]: UserDTO } = {};
  myUser!: any;
  @Input() parkings!: ParkingSpot[];
  @Input() sourcePage!: string;

  constructor(
    private authService: AuthService,
    public userService: UserService
  ) {}

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['parkings'] && changes['parkings'].currentValue) {
    // Fetch user information for each locker's occupant
      for (const parking of this.parkings) {
        console.log(parking.OccupantID);
        if (parking.OccupantID) {
          try {
            const user = await this.userService.getPublicUser(
              parking.OccupantID
            );
            if (user) {
              this.users[parking.OccupantID] = user;
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
      this.myUser = await this.authService.getUser(); // Add await here
      if (this.myUser) {
        this.authority = this.myUser.photoURL;
      } else {
        this.authority = '';
      }
    } catch (error) {
      console.error(error);
      this.authority = '';
    }
  }
}