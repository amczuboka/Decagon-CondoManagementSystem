import { Component, Input } from '@angular/core';
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
  dataSource: ParkingSpot[] = []; 
  @Input() parkings!: ParkingSpot[];

  constructor(
    public authService: AuthService,
    public userService: UserService
  ) {}

  async ngOnInit() {
    // Fetch user information for each locker's occupant
    if (this.parkings) {
      this.dataSource = this.parkings;
      await Promise.all(this.parkings.map(async (parking) => {
        if (parking.OccupantID) {
          try {
            const user = await this.userService.getPublicUser(parking.OccupantID);
            if (user) {
              this.users[parking.OccupantID] = user;
            }
          } catch (error) {
            console.error('Failed to get user', error);
          }
        }
      }));
    }
  
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