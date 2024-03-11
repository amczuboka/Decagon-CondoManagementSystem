import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Building, Facilities } from 'src/app/models/properties';
import { BuildingService } from 'src/app/services/building.service';
@Component({
  selector: 'app-building',
  templateUrl: './building.component.html',
  styleUrls: ['./building.component.scss'],
})
export class BuildingComponent {
  availableBuildings: Building[] | null = [];
  searchText: string = '';

  constructor(
    public buildingService: BuildingService,
    private router: Router,
  ) {}

  private buildingsSubscription: Subscription = new Subscription();;
  
  ngOnInit() {
    // Subscribe to the buildings$ observable
    this.buildingsSubscription = this.buildingService.buildings$.subscribe((buildings) => {
      if (buildings) {
        console.log(buildings);
        this.availableBuildings = Object.values(buildings);
      } else {
        // Handle case when buildings array is null
        console.log('Buildings array is null');
      }
    });
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
  getFacilityIcon(facility: Facilities): string {
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
      let building: any = { queryParams: { building: JSON.stringify(item) } };


      // Navigate to the building-info page with the specified navigation extras
      this.router.navigate(['/building-info'], building);
    }
}
