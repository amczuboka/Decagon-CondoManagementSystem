import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BuildingService } from 'src/app/services/building.service';
import { UserService } from 'src/app/services/user.service';
import { Building, Condo } from '../../models/properties';
import { UserDTO, CompanyDTO } from '../../models/users';
import { ActivatedRoute, Router } from '@angular/router';
import { EditCondoDialogComponent } from '../individual-condo/edit-condo-dialog/edit-condo-dialog.component';
import { Authority } from 'src/app/models/users';
import { AuthService } from 'src/app/services/auth.service';
import { Location } from '@angular/common';

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
  loggedInUserInfo: UserDTO | CompanyDTO | null = null;
  editDialogOpen: boolean = false;
  isFavorited: boolean = false;
  loggedInUser!: any;
  constructor(
    private dialog: MatDialog,
    private buildingService: BuildingService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private location: Location
  ) {}

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(async (params) => {
      const buildingId = params['buildingId'];
      const condoId = params['condoId'];
      await this.fetchBuildingAndCondoDetails(buildingId, condoId);
      await this.fetchUserInfo();
      this.loggedInUser = await this.fetchLoggedInUser();
      // this.myUser = await this.authService.getUser();
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
   this.location.back();
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
  async fetchLoggedInUser() {
    try {
      this.loggedInUser = await this.authService.getUser();
      if (this.loggedInUser) {
        // Use 'this.loggedInUser' for checking
        const classification = await this.userService.classifyUser(
          this.loggedInUser.uid
        );
        if (classification === 'company') {
          this.loggedInUserInfo = await this.userService.getCompanyUser(
            this.loggedInUser.uid
          );
        }
        return this.loggedInUser; // Use 'this.loggedInUser'
      }
      return null;
    } catch (error) {
      console.error('Error fetching logged-in user:', error);
      return null;
    }
  }

  isEditAllowed(): boolean {
    // Check if the user is logged in and a company user
    if (
      this.loggedInUserInfo &&
      this.loggedInUserInfo.Authority === Authority.Company
    ) {
      // Type assertion to CompanyDTO to access PropertyIds
      const companyUser = this.loggedInUserInfo as CompanyDTO;
      // Check if the company user has authority to edit this condo
      if (
        companyUser.PropertyIds?.includes(this.building?.ID || '') &&
        this.condo?.Status === 'Vacant'
      ) {
        return true;
      }
    }
    // If not a company user or does not have authority to edit, return false
    return false;
  }

  openEditCondoDialog(): void {
    // Check if editing is allowed for the current user
    if (this.isEditAllowed()) {
      // Open the edit dialog with the condo and building data
      const dialogRef = this.dialog.open(EditCondoDialogComponent, {
        width: '500px',
        data: {
          condo: this.condo,
          building: this.building,
        },
      });
      // Subscribe to dialog close event to handle edited data
      dialogRef.afterClosed().subscribe((result: Condo | undefined) => {
        if (result) {
          this.condo = result;
        }
      });
    } else {
      console.error('You are not authorized to edit this condo.');
    }
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
