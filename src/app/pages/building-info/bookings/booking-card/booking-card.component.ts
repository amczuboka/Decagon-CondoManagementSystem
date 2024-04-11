import { Component } from '@angular/core';
import { Building } from 'src/app/models/properties';
import { BuildingService } from 'src/app/services/building.service';

@Component({
  selector: 'app-booking-card',
  templateUrl: './booking-card.component.html',
  styleUrls: ['./booking-card.component.scss']
})
export class BookingCardComponent {


  buildingObj!: Building;

  constructor(
    private buildingService: BuildingService
  ) {}

  // ngInit(){
  //   this.buildingObj = this.buildingService.getBuilding();
  // }


  

}
