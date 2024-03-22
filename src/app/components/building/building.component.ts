import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Building, CondoStatus, Facilities, sourcePage } from 'src/app/models/properties';
import { Authority } from 'src/app/models/users';
import { AuthService } from 'src/app/services/auth.service';
import { BuildingService } from 'src/app/services/building.service';
@Component({
  selector: 'app-building',
  templateUrl: './building.component.html',
  styleUrls: ['./building.component.scss'],
})
export class BuildingComponent {
  buildings: Building[] | null = [];
  searchText: string = '';
  myUser!: any;
  authority!: string;
  @Input() sourcePage!: string;

  constructor(
    private buildingService: BuildingService,
    private router: Router,
    private authService: AuthService
  ) {}

  private buildingsSubscription: Subscription = new Subscription();

  async ngOnInit() {
    // Fetch the current user
      this.myUser = await this.authService.getUser();
      if (this.myUser) {
        this.authority = this.myUser.photoURL;
      } 

    // Subscribe to the buildings$ observable
    this.buildingsSubscription = this.buildingService.buildings$.subscribe(
      (buildings) => {
        if (buildings) {
          if (this.sourcePage == sourcePage.availablePage) {
            this.buildings = Object.values(buildings);
          } else if (this.sourcePage == sourcePage.propertiesPage) {
            if (this.authority == Authority.Company) {
              const availableBuildings = Object.values(buildings).filter((building: Building) => building.CompanyID === this.myUser.uid);
              this.buildings = availableBuildings;
            } else if (this.authority == Authority.Public) {
              const availableBuildings = Object.values(buildings).filter((building: Building) => {
                const condos = Object.values(building.Condos);
                return condos.some((condo) => condo.OccupantID === this.myUser.uid);
              });
              this.buildings = availableBuildings;
            } else {
              this.buildings = [];
            }
          }
        } else {
          // Handle case when buildings array is null
          this.buildings = [];
          console.log('Buildings array is null');
        }
      }
    );
  }

  ngOnDestroy() {
    // Unsubscribe from the observable to avoid memory leaks
    if (this.buildingsSubscription) {
      this.buildingsSubscription.unsubscribe();
    }
  }

  // Event handler for when search text changes
  onSearchTextEntered(searchValue: string) {
    this.searchText = searchValue;
    console.log('a letter', this.searchText);
  }

  // Function to get the corresponding icon for each facility
  // Parameters:
  // - facility: The type of facility (enum Facilities)
  // Returns: The corresponding material icon name as a string
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
   * Navigate to the building-info page for the selected building item
   *
   * @param item - The building item to view the info for
   */
  navigateToBuildingInfo(item: Building): void {
    // Prepare navigation extras with the selected building item as a query parameter
    let info: any = {
      queryParams: {
        building: JSON.stringify(item),
        sourcePage: this.sourcePage,
      },
    };

    // Navigate to the building-info page with the specified navigation extras
    this.router.navigate(['/building-info'], info)
  }

  /**
   * Calculate the number of condos in the building
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
}
