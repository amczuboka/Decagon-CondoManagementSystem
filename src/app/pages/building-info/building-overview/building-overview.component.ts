import { Component, Input } from '@angular/core';
import { Building, CondoStatus, ParkingLockerStatus } from 'src/app/models/properties';
import { CompanyDTO } from 'src/app/models/users';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-building-overview',
  templateUrl: './building-overview.component.html',
  styleUrls: ['./building-overview.component.scss']
})

export class BuildingOverviewComponent {
  @Input() building!: Building;
  @Input() sourcePage!: string;
  myCompany: CompanyDTO | null=null;
  authority!: string;

  constructor(
    private authService: AuthService,
    public userService: UserService
  ) {}

  
    /**
   * Calculate the total number of condos in the building
   *
   * @param building - The building object
   * @returns The number of condos
   */
    calculateTotalCondos(building: Building): number {
      const condos = Object.values(building.Condos);
      return condos.length;
    }

    /**
   * Calculate the number of available condos in the building
   *
   * @param building - The building object
   * @returns The number of available condos
   */
    calculateAvailableCondos(building: Building): number {
      const condos = Object.values(building.Condos);
      const availableCondos = condos.filter((condo) => condo.Status == CondoStatus.Vacant).length;
      return availableCondos;
    }

    /**
   * Calculate the total number of parking spots in the building
   *
   * @param building - The building object
   * @returns The number of parking spots
   */
    calculateTotalParkings(building: Building): number {
      const parkings = Object.values(building.Parkings);
      return parkings.length;
    }

    /**
   * Calculate the number of available parking spots in the building
   *
   * @param building - The building object
   * @returns The number of parking spots
   */
    calculateAvailableParkings(building: Building): number {
      const parkings = Object.values(building.Parkings);
      const availableParkings = parkings.filter((parking) => parking.Status == ParkingLockerStatus.Available).length;
      return availableParkings;
    }


    /**
   * Calculate the number of lockers in the building
   *
   * @param building - The building object
   * @returns The number of lockers
   */
    calculateTotalLockers(building: Building): number {
      const lockers = Object.values(building.Lockers);
      return lockers.length;
    }

    /**
   * Calculate the number of available lockers in the building
   *
   * @param building - The building object
   * @returns The number of available lockers
   */
    calculateAvailableLockers(building: Building): number {
      const lockers = Object.values(building.Lockers);
      const availableLockers = lockers.filter((locker) => locker.Status == ParkingLockerStatus.Available).length;
      return availableLockers;
    }

}
    
 
    
    

  


