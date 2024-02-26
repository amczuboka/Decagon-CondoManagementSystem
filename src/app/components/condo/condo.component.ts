import { Component } from '@angular/core';
import { Condo, Status, CondoType } from 'src/app/models/properties';

@Component({
  selector: 'app-condo',
  templateUrl: './condo.component.html',
  styleUrls: ['./condo.component.scss'],
})
export class CondoComponent {
  condos: Condo[] = [
    {
      ID: '100',
      Type: CondoType.Rent,
      OccupantID: '',
      UnitNumber: '25',
      Fee: 1500,
      Picture: 'assets/imgs/Condo1.jpg',
      Description: '',
      NumberOfBedrooms: 3,
      NumberOfBathrooms: 2,
      Status: Status.Vacant,
      SquareFootage: 1100,
    },
    {
      ID: '200',
      Type: CondoType.Sale,
      OccupantID: '',
      UnitNumber: '30',
      Fee: 450000,
      Picture: 'assets/imgs/Condo2.jpg',
      Description: '',
      NumberOfBedrooms: 2,
      NumberOfBathrooms: 1,
      Status: Status.Vacant,
      SquareFootage: 700,
    },
  ];
}
