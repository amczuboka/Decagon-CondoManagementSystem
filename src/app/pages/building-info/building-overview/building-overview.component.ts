import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Building, Facilities, CondoStatus, ParkingLockerStatus } from 'src/app/models/properties';
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
  authority!: string;
  company: CompanyDTO | null=null;

  constructor(
    private authService: AuthService,
    public userService: UserService
  ) {}

  async ngOnInit() {
    await this.fetchCompany();
  }

  async fetchCompany(){
    this.company = await this.userService.getCompanyUser(this.building.CompanyID);
  }

  /**
   * Get Facility Icon
   * @param facility 
   * @returns facility icon
   */
  getFacilityIcon(facility: string): string {
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
    
 
    
    

  


