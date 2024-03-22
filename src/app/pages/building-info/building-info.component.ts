import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Building,
  Condo,
  CondoStatus,
  Locker,
  ParkingLockerStatus,
  ParkingSpot,
  sourcePage,
} from 'src/app/models/properties';
import { Authority } from 'src/app/models/users';
import { AuthService } from 'src/app/services/auth.service';
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
  sourcePage!: string;
  myUser!: any;
  authority!: string;
  buildingAddress!: string;

  constructor(
    private route: ActivatedRoute,
    private buildingService: BuildingService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    // Fetch the current user
    this.myUser = await this.authService.getUser();
    if (this.myUser) {
      this.authority = this.myUser.photoURL;
    }

    //Get the query Params that were passed by the building component
    this.route.queryParams.subscribe((params) => {
      this.building = JSON.parse(params['building']);
      this.sourcePage = params['sourcePage'];

      //Subscribe to the building with the building.ID for real time updates
      this.buildingService.subscribeToBuildingById(this.building.ID).subscribe({
        next: (updatedBuilding: any) => {
          if (updatedBuilding) {
            this.building = updatedBuilding;
            this.buildingAddress = updatedBuilding.Address;
            if (this.sourcePage == sourcePage.availablePage) {
              this.condos = updatedBuilding.Condos;
              this.condos = this.condos.filter(
                (condo: Condo) => condo.Status === CondoStatus.Vacant
              );

              this.lockers = updatedBuilding.Lockers;
              this.lockers = this.lockers.filter(
                (locker: Locker) =>
                  locker.Status === ParkingLockerStatus.Available
              );

              this.parkings = updatedBuilding.Parkings;
              this.parkings = this.parkings.filter(
                (parking: ParkingSpot) =>
                  parking.Status === ParkingLockerStatus.Available
              );
            } else {
              if (this.authority == Authority.Company) {
                this.condos = updatedBuilding.Condos;

                this.lockers = updatedBuilding.Lockers;

                this.parkings = updatedBuilding.Parkings;
              } else {
                this.condos = updatedBuilding.Condos;
                this.condos = this.condos.filter(
                  (condo: Condo) => condo.OccupantID === this.myUser.uid
                );

                this.lockers = updatedBuilding.Lockers;
                this.lockers = this.lockers.filter(
                  (locker: Locker) => locker.OccupantID === this.myUser.uid
                );

                this.parkings = updatedBuilding.Parkings;
                this.parkings = this.parkings.filter(
                  (parking: ParkingSpot) =>
                    parking.OccupantID === this.myUser.uid
                );
              }
            }
          }
        },
      });
    });
  }
}
