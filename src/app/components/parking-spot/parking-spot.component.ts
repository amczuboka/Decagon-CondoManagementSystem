import { Component } from '@angular/core';
import {
  ParkingLockerStatus,
  ParkingSpot,
  ParkingType,
} from 'src/app/models/properties';
import { User, UserDTO } from 'src/app/models/users';
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

  // Hardcoded array of 10 fake ParkingSpot objects
  fakeParkingSpots: ParkingSpot[] = [
    {
      ID: '1',
      OccupantID: 'T28vqPCtohTj2V1lJabmjHXRYYt1',
      Number: 'P001',
      Status: ParkingLockerStatus.Available,
      ParkingType: ParkingType.Standard,
      Fee: 50,
    },
    {
      ID: '2',
      OccupantID: 'T28vqPCtohTj2V1lJabmjHXRYYt1',
      Number: 'P002',
      Status: ParkingLockerStatus.Available,
      ParkingType: ParkingType.Standard,
      Fee: 75,
    },
    {
      ID: '3',
      OccupantID: 'T28vqPCtohTj2V1lJabmjHXRYYt1',
      Number: 'P003',
      Status: ParkingLockerStatus.Unavailable,
      ParkingType: ParkingType.Handicap,
      Fee: 100,
    },
    {
      ID: '4',
      OccupantID: 'T28vqPCtohTj2V1lJabmjHXRYYt1',
      Number: 'P004',
      Status: ParkingLockerStatus.Unavailable,
      ParkingType: ParkingType.Standard,
      Fee: 120,
    },
    {
      ID: '5',
      OccupantID: 'T28vqPCtohTj2V1lJabmjHXRYYt1',
      Number: 'P005',
      Status: ParkingLockerStatus.Available,
      ParkingType: ParkingType.Handicap,
      Fee: 55,
    },
    {
      ID: '6',
      OccupantID: 'T28vqPCtohTj2V1lJabmjHXRYYt1',
      Number: 'P006',
      Status: ParkingLockerStatus.Available,
      ParkingType: ParkingType.Standard,
      Fee: 80,
    },
    {
      ID: '7',
      OccupantID: 'T28vqPCtohTj2V1lJabmjHXRYYt1',
      Number: 'P007',
      Status: ParkingLockerStatus.Unavailable,
      ParkingType: ParkingType.Handicap,
      Fee: 110,
    },
    {
      ID: '8',
      OccupantID: 'T28vqPCtohTj2V1lJabmjHXRYYt1',
      Number: 'P008',
      Status: ParkingLockerStatus.Unavailable,
      ParkingType: ParkingType.Standard,
      Fee: 130,
    },
    {
      ID: '9',
      OccupantID: 'T28vqPCtohTj2V1lJabmjHXRYYt1',
      Number: 'P009',
      Status: ParkingLockerStatus.Available,
      ParkingType: ParkingType.Handicap,
      Fee: 60,
    },
    {
      ID: '10',
      OccupantID: 'T28vqPCtohTj2V1lJabmjHXRYYt1',
      Number: 'P010',
      Status: ParkingLockerStatus.Available,
      ParkingType: ParkingType.Standard,
      Fee: 85,
    },
  ];

  constructor(
    public authService: AuthService,
    public userService: UserService
  ) {}

  ngOnInit() {
    // Fetch user information for each locker's occupant
    this.fakeParkingSpots.forEach(async (parking) => {
      if (parking.OccupantID) {
        const user = await this.userService.getPublicUser(parking.OccupantID);
        if (user) {
          this.users[parking.OccupantID] = user;
        }
      }
    });
  }

  ngAfterViewChecked() {
    this.myUser = this.authService.getUser();
    if (this.myUser) {
      this.authority = this.myUser.photoURL;
    }
  }
}
