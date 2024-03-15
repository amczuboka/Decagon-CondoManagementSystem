import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BuildingService } from 'src/app/services/building.service';
import { UserService } from 'src/app/services/user.service';
import { Building, Condo } from '../../models/properties';
import { UserDTO } from '../../models/users';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-individual-condo',
  templateUrl: './individual-condo.component.html',
  styleUrls: ['./individual-condo.component.scss'],
})
export class IndividualCondoComponent implements OnInit {
  building: Building | null = null;
  condo: Condo | null = null;
  userInfo: UserDTO | null = null;

  constructor(
    private dialog: MatDialog,
    private buildingService: BuildingService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(async (params) => {
      const buildingId = params['buildingId'];
      const condoId = params['condoId'];
      await this.fetchBuildingAndCondoDetails(buildingId, condoId);
      await this.fetchUserInfo();
    });
  }

  async fetchBuildingAndCondoDetails(
    buildingId: string,
    condoId: string
  ): Promise<void> {
    try {
      const buildingDetails = await this.buildingService.getBuilding(
        buildingId
      );
      if (buildingDetails) {
        this.building = buildingDetails;
        // Now find the specific condo in the building's condos array
        this.condo =
          this.building.Condos?.find((condo) => condo.ID === condoId) || null;
        if (!this.condo) {
          console.error('Condo not found in the building');
        }
      } else {
        console.error('Building details not found');
      }
    } catch (error: any) {
      console.error(
        'Error fetching building and condo details:',
        error.message
      );
    }
  }

  async fetchUserInfo(): Promise<void> {
    const userId = this.userService.getCurrentUserId();
    console.log('Current user ID:', userId); // Log current user ID
    if (userId) {
      let userDetails: UserDTO | null = null;
      userDetails =
        (await this.userService.getCompanyUser(userId)) ||
        (await this.userService.getPublicUser(userId));
      this.userInfo = userDetails || null; // Set user info if found
      console.log('User details:', userDetails); // Log user details
    }
  }

  goBack(): void {
    // Navigate to previous route
    this.router.navigateByUrl('./condos');
  }
  share() {
    console.log('Functionality not implemented yet.');
  }

  favorite() {
    console.log('Functionality not implemented yet.');
  }

  refresh() {
    this.router.navigate([], {
      relativeTo: this.route,
      replaceUrl: true,
      queryParamsHandling: 'merge',
    });
  }

  editCondo() {
    console.log('Functionality not implemented yet.');
  }
}
