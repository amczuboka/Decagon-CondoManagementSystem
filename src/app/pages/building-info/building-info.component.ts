import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Building,
  Condo,
  Locker,
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

  constructor(
    private route: ActivatedRoute,
    private buildingService: BuildingService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    // Fetch the current user
    try {
      this.myUser = await this.authService.getUser();
      if (this.myUser) {
        this.authority = this.myUser.photoURL;
      } else {
        this.authority = '';
      }
    } catch (error) {
      console.error(error);
      this.authority = '';
    }

    this.route.queryParams.subscribe((params) => {
      try {
        this.building = JSON.parse(params['building']);
        this.sourcePage = params['sourcePage'];
      } catch (error) {
        this.condos = [];
        this.lockers = [];
        this.parkings = [];
        console.error('Invalid building parameter', 'Error');
        return;
      }

      this.buildingService.subscribeToBuildingById(this.building.ID).subscribe({
        next: (updatedBuilding: any) => {
          if (updatedBuilding) {
            if (this.sourcePage == sourcePage.availablePage) {
              this.condos = Object.values(
                updatedBuilding.Condos || {}
              ) as Condo[];
              this.condos = this.condos.filter(
                (condo: Condo) => condo.Status === 'Vacant'
              );

              this.lockers = Object.values(
                updatedBuilding.Lockers || {}
              ) as Locker[];
              this.lockers = this.lockers.filter(
                (locker: Locker) => locker.Status === 'Available'
              );

              this.parkings = Object.values(
                updatedBuilding.Parkings || {}
              ) as ParkingSpot[];
              this.parkings = this.parkings.filter(
                (parking: ParkingSpot) => parking.Status === 'Available'
              );
            } else if (this.sourcePage == sourcePage.propertiesPage) {
              if (this.authority == Authority.Company) {
                this.condos = Object.values(
                  updatedBuilding.Condos || {}
                ) as Condo[];

                this.lockers = Object.values(
                  updatedBuilding.Lockers || {}
                ) as Locker[];

                this.parkings = Object.values(
                  updatedBuilding.Parkings || {}
                ) as ParkingSpot[];

              } else if (this.authority == Authority.Public) {
                this.condos = Object.values(updatedBuilding.Condos || {}) as Condo[];
                this.condos = this.condos.filter((condo: Condo) => condo.OccupantID === this.myUser.uid);

                this.lockers = Object.values(updatedBuilding.Lockers || {}) as Locker[];
                this.lockers = this.lockers.filter((locker: Locker) => locker.OccupantID === this.myUser.uid);

                this.parkings = Object.values(updatedBuilding.Parkings || {}) as ParkingSpot[];
                this.parkings = this.parkings.filter((parking: ParkingSpot) => parking.OccupantID === this.myUser.uid);
              } else {
                this.condos = [];
                this.lockers = [];
                this.parkings = [];
              }
            } else {
              this.condos = [];
              this.lockers = [];
              this.parkings = [];
            }
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
        },
      });
    });
  }
}
