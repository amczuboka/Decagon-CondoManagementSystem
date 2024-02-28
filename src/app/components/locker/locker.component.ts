import { Component } from '@angular/core';
import {
  Locker,
  LockerSize,
  ParkingLockerStatus,
} from 'src/app/models/properties';
import { UserDTO } from 'src/app/models/users';
import { AuthService } from 'src/app/services/auth.service';
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

  // Hardcoded array of 10 fake Locker objects
  fakeLockers: Locker[] = [
    {
      ID: '1',
      OccupantID: 'T28vqPCtohTj2V1lJabmjHXRYYt1',
      Number: 'L001',
      Status: ParkingLockerStatus.Unavailable,
      Size: LockerSize.size1,
      Fee: 50,
    },
    {
      ID: '2',
      OccupantID: 'T28vqPCtohTj2V1lJabmjHXRYYt1',
      Number: 'L002',
      Status: ParkingLockerStatus.Available,
      Size: LockerSize.size2,
      Fee: 75,
    },
    {
      ID: '3',
      OccupantID: 'T28vqPCtohTj2V1lJabmjHXRYYt1',
      Number: 'L003',
      Status: ParkingLockerStatus.Unavailable,
      Size: LockerSize.size3,
      Fee: 100,
    },
    {
      ID: '4',
      OccupantID: 'T28vqPCtohTj2V1lJabmjHXRYYt1',
      Number: 'L004',
      Status: ParkingLockerStatus.Unavailable,
      Size: LockerSize.size4,
      Fee: 120,
    },
    {
      ID: '5',
      OccupantID: 'T28vqPCtohTj2V1lJabmjHXRYYt1',
      Number: 'L005',
      Status: ParkingLockerStatus.Available,
      Size: LockerSize.size1,
      Fee: 55,
    },
    {
      ID: '6',
      OccupantID: 'T28vqPCtohTj2V1lJabmjHXRYYt1',
      Number: 'L006',
      Status: ParkingLockerStatus.Available,
      Size: LockerSize.size2,
      Fee: 80,
    },
    {
      ID: '7',
      OccupantID: 'T28vqPCtohTj2V1lJabmjHXRYYt1',
      Number: 'L007',
      Status: ParkingLockerStatus.Unavailable,
      Size: LockerSize.size3,
      Fee: 110,
    },
    {
      ID: '8',
      OccupantID: 'T28vqPCtohTj2V1lJabmjHXRYYt1',
      Number: 'L008',
      Status: ParkingLockerStatus.Unavailable,
      Size: LockerSize.size4,
      Fee: 130,
    },
    {
      ID: '9',
      OccupantID: 'T28vqPCtohTj2V1lJabmjHXRYYt1',
      Number: 'L009',
      Status: ParkingLockerStatus.Available,
      Size: LockerSize.size1,
      Fee: 60,
    },
    {
      ID: '10',
      OccupantID: 'T28vqPCtohTj2V1lJabmjHXRYYt1',
      Number: 'L010',
      Status: ParkingLockerStatus.Available,
      Size: LockerSize.size2,
      Fee: 85,
    },
  ];

  constructor(
    public authService: AuthService,
    public userService: UserService
  ) {}

  ngOnInit() {
    // Fetch user information for each locker's occupant
    this.fakeLockers.forEach(async (locker) => {
      if (locker.OccupantID) {
        const user = await this.userService.getPublicUser(locker.OccupantID);
        if (user) {
          this.users[locker.OccupantID] = user;
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
