import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BuildingService } from 'src/app/services/building.service';
import { UserService } from 'src/app/services/user.service';
import { Building, Condo } from '../../models/properties';
import { UserDTO, CompanyDTO } from '../../models/users';
import { ActivatedRoute, Router } from '@angular/router';
import { EditCondoDialogComponent } from '../individual-condo/edit-condo-dialog/edit-condo-dialog.component';

@Component({
  selector: 'app-individual-condo',
  templateUrl: './individual-condo.component.html',
  styleUrls: ['./individual-condo.component.scss'],
})
export class IndividualCondoComponent implements OnInit {
  @Output() condoEdited: EventEmitter<any> = new EventEmitter<any>();
  building: Building | null = null;
  condo: Condo | null = null;
  userInfo: UserDTO | CompanyDTO | null = null;
  editDialogOpen: boolean = false;
  isFavorited: boolean = false;

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

  isAuthorizedCompany(): boolean {
    // Check if user logged in and user's company ID matches the building's company ID
     if (this.userInfo && 'CompanyID' in this.userInfo) {
       return this.userInfo.CompanyID === this.building?.CompanyID;
     }
     return false;
  }

  async fetchUserInfo(): Promise<void> {
    if (this.condo?.Status === 'Vacant') {
      this.userInfo = await this.userService.getCompanyUser(
        this.building?.CompanyID || ''
      );
    } else {
      this.userInfo = await this.userService.getPublicUser(
        this.condo?.OccupantID || ''
      );
      if (!this.userInfo) {
        this.userInfo = await this.userService.getEmployeeUser(
          this.condo?.OccupantID || ''
        );
      }
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
    this.isFavorited = !this.isFavorited;
    console.log('Item favorited.');
  }

  refresh() {
    window.location.reload();
  }

  openEditCondoDialog(): void {
    const dialogRef = this.dialog.open(EditCondoDialogComponent, {
      width: '500px',
      data: {
        condo: this.condo,
        building: this.building,
      },
    });
    dialogRef.afterClosed().subscribe((result: Condo | undefined) => {
      if (result) {
        // Update the condo data after editing
        this.condo = result;
      }
    });
  }

  closeEditDialog(): void {
    this.editDialogOpen = false;
  }

  handleCondoEdited(event: any): void {
    console.log('Condo edited:', event);
    const updatedCondoData: Condo = event;
    if (this.condo) {
      this.condo = updatedCondoData;
    }
  }
}
