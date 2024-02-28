import { Component } from '@angular/core';
import { Building, Facilities } from 'src/app/models/properties';
@Component({
  selector: 'app-building',
  templateUrl: './building.component.html',
  styleUrls: ['./building.component.scss'],
})
export class BuildingComponent {
  buildings: Building[] = [
    {
      ID: '1',
      Year: 2010,
      Description:
        'Building A is a 10-unit building with no parking or lockers. It has a gym and a pool.',
      CompanyID: 'A123',
      Name: 'Building A',
      Address: '123 Main St',
      Parkings: [],
      Lockers: [],
      Condos: [],
      Picture: 'assets/imgs/building1.jpg',
      Facilities: [
        Facilities.Locker,
        Facilities.Spa,
        Facilities.Pool,
        Facilities.Gym,
        Facilities.Playground,
        Facilities.MeetingRoom,
        Facilities.Parking,
      ],
      Bookings: [],
    },
    {
      ID: '2',
      Year: 2010,
      Description:
        'Building A is a 10-unit building with no parking or lockers. It has a gym and a pool.',
      CompanyID: 'B456',
      Name: 'Building B',
      Address: '456 Oak St',
      Parkings: [],
      Lockers: [],
      Condos: [],
      Picture: 'assets/imgs/building1.jpg',
      Facilities: [Facilities.MeetingRoom],
      Bookings: [],
    },
    {
      ID: '3',
      Description:
        'Building A is a 10-unit building with no parking or lockers. It has a gym and a pool.',
      Year: 2012,
      CompanyID: 'C789',
      Name: 'Building C',
      Address: '789 Elm St',
      Parkings: [],
      Lockers: [],
      Condos: [],
      Picture: 'assets/imgs/building1.jpg',
      Facilities: [Facilities.Playground, Facilities.MeetingRoom],
      Bookings: [],
    },
    {
      ID: '4',
      Description:
        'Building A is a 10-unit building with no parking or lockers. It has a gym and a pool.',
      Year: 2015,
      CompanyID: 'D101',
      Name: 'Building D',
      Address: '101 Pine St',
      Parkings: [],
      Lockers: [],
      Condos: [],
      Picture: 'assets/imgs/building1.jpg',
      Facilities: [Facilities.Parking, Facilities.Gym],
      Bookings: [],
    },
    {
      ID: '5',
      Description:
        'Building A is a 10-unit building with no parking or lockers. It has a gym and a pool.',
      Year: 2020,
      CompanyID: 'E202',
      Name: 'Building E',
      Address: '202 Cedar St',
      Parkings: [],
      Lockers: [],
      Condos: [],
      Picture: 'assets/imgs/building1.jpg',
      Facilities: [Facilities.Pool],
      Bookings: [],
    },
  ];

  searchText: string = '';

  // Event handler for when search text changes
  onSearchTextEntered(searchValue: string) {
    this.searchText = searchValue;
    console.log('a letter', this.searchText);
  }

  // Function to get the corresponding icon for each facility
  // Parameters:
  // - facility: The type of facility (enum Facilities)
  // Returns: The corresponding material icon name as a string
  getFacilityIcon(facility: Facilities): string {
    switch (facility) {
      case Facilities.Gym:
        return 'fitness_center';
      case Facilities.Pool:
        return 'pool';
      case Facilities.Spa:
        return 'spa';
      case Facilities.Locker:
        return 'locker';
      case Facilities.Parking:
        return 'local_parking';
      case Facilities.Playground:
        return 'child_friendly';
      case Facilities.MeetingRoom:
        return 'meeting_room';
      default:
        return '';
    }
  }
}
