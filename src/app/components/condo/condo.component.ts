import { Component } from '@angular/core';
import { Condo, CondoStatus, CondoType } from 'src/app/models/properties';
import { Router } from '@angular/router';

@Component({
  selector: 'app-condo',
  templateUrl: './condo.component.html',
  styleUrls: ['./condo.component.scss'],
})
export class CondoComponent {
  constructor(private router: Router) {}

  requestOwnership() {
    // Navigate to the 'key-registration' page
    this.router.navigate(['/key-registration']);
  }

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
      Status: CondoStatus.Vacant,
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
      Status: CondoStatus.Vacant,
      SquareFootage: 700,
    },
  ];
}
