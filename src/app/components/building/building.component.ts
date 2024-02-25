import { Component } from '@angular/core';
import { Building, Facilities } from 'src/app/models/properties';
@Component({
  selector: 'app-building',
  templateUrl: './building.component.html',
  styleUrls: ['./building.component.scss']
})
export class BuildingComponent {
  buildings: Building[] = [
    {
      ID: '1',
      Year: 2010,
      Description: 'Building A is a 10-unit building with no parking or lockers. It has a gym and a pool.',
      CompanyID: 'A123',
      Name: 'Building A',
      UnitCount: 10,
      ParkingCount: 0,
      LockerCount: 0,
      Address: '123 Main St',
      Parkings: [],
      Lockers: [],
      Condos: [],
      Picture: 'assets/imgs/building1.jpg',
      Facilities: [Facilities.Gym, Facilities.Pool],
    },
    {
      ID: '2',
      Year: 2010,
      Description: 'Building A is a 10-unit building with no parking or lockers. It has a gym and a pool.',
      CompanyID: 'B456',
      Name: 'Building B',
      UnitCount: 15,
      ParkingCount: 0,
      LockerCount: 0,
      Address: '456 Oak St',
      Parkings: [],
      Lockers: [],
      Condos: [],
      Picture: 'assets/imgs/building1.jpg',
      Facilities: [Facilities.Parking, Facilities.Concierge],
    },
    {
      ID: '3',
      Description: 'Building A is a 10-unit building with no parking or lockers. It has a gym and a pool.',
      Year: 2012,
      CompanyID: 'C789',
      Name: 'Building C',
      UnitCount: 20,
      ParkingCount: 0,
      LockerCount: 0,
      Address: '789 Elm St',
      Parkings: [],
      Lockers: [],
      Condos: [],
      Picture: 'assets/imgs/building1.jpg',
      Facilities: [Facilities.Playground, Facilities.MeetingRoom],
    },
    {
      ID: '4',
      Description: 'Building A is a 10-unit building with no parking or lockers. It has a gym and a pool.',
      Year: 2015,
      CompanyID: 'D101',
      Name: 'Building D',
      UnitCount: 12,
      ParkingCount: 0,
      LockerCount: 0,
      Address: '101 Pine St',
      Parkings: [],
      Lockers: [],
      Condos: [],
      Picture: 'assets/imgs/building1.jpg',
      Facilities: [Facilities.Parking, Facilities.Gym],
    },
    {
      ID: '5',
      Description: 'Building A is a 10-unit building with no parking or lockers. It has a gym and a pool.',
      Year: 2020,
      CompanyID: 'E202',
      Name: 'Building E',
      UnitCount: 8,
      ParkingCount: 0,
      LockerCount: 0,
      Address: '202 Cedar St',
      Parkings: [],
      Lockers: [],
      Condos: [],
      Picture: 'assets/imgs/building1.jpg',
      Facilities: [Facilities.Concierge, Facilities.Pool],
    },
  ];

  searchText: string = '';

  onSearchTextEntered(searchValue: string) {
    this.searchText = searchValue;
    console.log('a letter', this.searchText);
  }
}
