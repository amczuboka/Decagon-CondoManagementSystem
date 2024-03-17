import { Component } from '@angular/core';
import {
  Building,
  Condo,
  CondoStatus,
  CondoType,
} from '../../models/properties';
import { UserDTO, Authority, Notification } from '../../models/users';

@Component({
  selector: 'app-individual-condo',
  templateUrl: './individual-condo.component.html',
  styleUrls: ['./individual-condo.component.scss'],
})
export class IndividualCondoComponent {
  building: Building = {
    Name: 'Majestic Condo',
    Address:
      '2800 Boulevard Cote Vertu Ouest, Montreal, Quebec, Canada, H4R 2M5',
    Year: 2007,
    ID: '',
    CompanyID: '',
    Bookings: [],
    Description: '',
    Parkings: [],
    Lockers: [],
    Condos: [],
    Picture: '',
    Facilities: [],
  };

  condo: Condo = {
    UnitNumber: ' Unit 201',
    Fee: 325000,
    Picture:
      'https://ruthkrishnan.com/wp-content/uploads/2021/06/FS706_Tower37A_Living-Room-2-768x511.jpg',
    Description:
      'Spacious apartment available for sale in a prime location. This beautifully designed apartment features modern amenities and breathtaking views.\n With 2 bedrooms and 1 bathrooms, it offers ample living space for a comfortable lifestyle.\n The apartment is conveniently located close to schools, parks, shopping centers, and public transportation, making it an ideal choice for families and professionals alike.\n Dont miss this opportunity to own your dream home!',
    NumberOfBedrooms: 2,
    NumberOfBathrooms: 1,
    SquareFootage: 1000,
    ID: '',
    Type: CondoType.Sale,
    OccupantID: '',
    Status: CondoStatus.Vacant,
  };

  userInfo: UserDTO = {
    ProfilePicture:
      'https://slidesbase.com/wp-content/uploads/2023/07/03-happy-young-latin-real-estate-agent-woman-stock-photo_slidesbase-1.jpg',
    FirstName: 'Maria',
    LastName: 'Lapa',
    Email: 'marialapa@gmail.com',
    PhoneNumber: '+1 (514)-567-8901',
    Authority: Authority.Public,
    ID: '1234',
    UserName: 'marialapa',
    Notifications: [
      {
        Message: 'Your request has been approved.',
        Date: new Date().getTime(),
        New: true,
        SenderId: '1234',
      },
      {
        Message: 'Your request has been approved.',
        Date: new Date().getTime(),
        New: true,
        SenderId: '1234',
      },
      {
        Message: 'Your request has been approved.',
        Date: new Date().getTime(),
        New: true,
        SenderId: '1234',
      },
    ],
  };

  loading = false;

  goBack() {
    console.log('Functionality not implemented yet.');
  }

  share() {
    console.log('Functionality not implemented yet.');
  }

  favorite() {
    console.log('Functionality not implemented yet.');
  }

  refresh() {
    console.log('Functionality not implemented yet.');
  }
}
