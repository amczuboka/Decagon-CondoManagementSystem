import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Building,
  Condo,
  Locker,
  ParkingSpot,
} from 'src/app/models/properties';
import { BuildingService } from 'src/app/services/building.service';

@Component({
  selector: 'app-building-info',
  templateUrl: './building-info.component.html',
  styleUrls: ['./building-info.component.scss'],
})
export class BuildingInfoComponent {
  building!: Building;
  condos!: Condo[];
  lockers!: Locker[];
  parkings!: ParkingSpot[];

  constructor(
    private route: ActivatedRoute,
    private buildingService: BuildingService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      try {
        this.building = JSON.parse(params['building']);
      } catch (error) {
        this.condos = [];
        this.lockers = [];
        this.parkings = [];
        console.error('Invalid building parameter', 'Error');
        return;
      }
  
      this.buildingService
        .subscribeToBuildingById(this.building.ID)
        .subscribe({
          next: (updatedBuilding: any) => {
            if (updatedBuilding) {
              this.condos = Object.values(updatedBuilding.Condos || {}) as Condo[];
              this.condos = this.condos.filter((condo: Condo) => condo.Status === 'Vacant');
  
              this.lockers = Object.values(updatedBuilding.Lockers || {}) as Locker[];
              this.lockers = this.lockers.filter((locker: Locker) => locker.Status === 'Available');
  
              this.parkings = Object.values(updatedBuilding.Parkings || {}) as ParkingSpot[];
              this.parkings = this.parkings.filter((parking: ParkingSpot) => parking.Status === 'Available');
            } else {
              this.condos = [];
              this.lockers = [];
              this.parkings = [];
            }
          },
          error: (error: any) => {
            console.error(error);
            this.condos = [];
            this.lockers = [];
            this.parkings = [];
          }
        });
    });
  }
}
