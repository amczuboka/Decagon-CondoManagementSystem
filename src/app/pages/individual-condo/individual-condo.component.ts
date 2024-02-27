import { Component } from '@angular/core';
import { BuildingDTO, CondoDTO } from '../../models/properties';

@Component({
  selector: 'app-individual-condo',
  templateUrl: './individual-condo.component.html',
  styleUrls: ['./individual-condo.component.scss'],
})
export class IndividualCondoComponent {

  building: BuildingDTO = {
    Name: 'Majestic Condo',
    Address: '2800 Boulevard Cote Vertu Ouest, Saint-Laurent, QC H4R 2M5',
    Year: 2007
  };

  condo: CondoDTO = {
    UnitNumber: ' Unit 201',
    Fee: 325000,
    Picture: 'https://ruthkrishnan.com/wp-content/uploads/2021/06/FS706_Tower37A_Living-Room-2-768x511.jpg', 
    Description: 'Spacious apartment available for sale in a prime location. This beautifully designed apartment features modern amenities and breathtaking views.\n With 2 bedrooms and 1 bathrooms, it offers ample living space for a comfortable lifestyle.\n The apartment is conveniently located close to schools, parks, shopping centers, and public transportation, making it an ideal choice for families and professionals alike.\n Dont miss this opportunity to own your dream home!',
    NumberOfBedrooms: 2,
    NumberOfBathrooms: 1,
    SquareFootage: 1000,
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