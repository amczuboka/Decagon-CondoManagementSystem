import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { IndividualCondoComponent } from './individual-condo.component';
import { UserService } from '../../services/user.service';
import { BuildingService } from '../../services/building.service';
import { EditCondoDialogComponent } from './edit-condo-dialog/edit-condo-dialog.component';
import { Condo, CondoStatus, CondoType } from 'src/app/models/properties';
import { AuthService } from 'src/app/services/auth.service';
import { Authority } from 'src/app/models/users';
import { Location } from '@angular/common';

describe('IndividualCondoComponent', () => {
  let component: IndividualCondoComponent;
  let fixture: ComponentFixture<IndividualCondoComponent>;
  let mockActivatedRoute;
  let mockRouter: any;
  let mockUserService: any;
  let mockBuildingService: any;
  let mockDialog: any;
  let mockAuthService: any;
  let mockLocation: any;

  beforeEach(async () => {
    mockActivatedRoute = { params: of({ buildingId: '1', condoId: '2' }) };
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);
    mockUserService = jasmine.createSpyObj('UserService', [
      'getCompanyUser',
      'getPublicUser',
      'getEmployeeUser',
    ]);
    mockBuildingService = jasmine.createSpyObj('BuildingService', [
      'getBuilding',
    ]);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getUser']);
    mockLocation = jasmine.createSpyObj('Location', ['back']);

    await TestBed.configureTestingModule({
      declarations: [IndividualCondoComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: UserService, useValue: mockUserService },
        { provide: BuildingService, useValue: mockBuildingService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Location, useValue: mockLocation },
        { provide: BuildingService, useValue: mockBuildingService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(IndividualCondoComponent);
    component = fixture.componentInstance;
    mockDialog.open.and.returnValue({ afterClosed: () => of(null) }); // Prepare mock for dialog
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle favorite status when favorite method is called', () => {
    expect(component.isFavorited).toBeFalse();
    component.favorite();
    expect(component.isFavorited).toBeTrue();
    component.favorite();
    expect(component.isFavorited).toBeFalse();
  });

  it('should call Location.back when goBack is called', () => {
    component.goBack();
    expect(mockLocation.back).toHaveBeenCalled();
  });

  it('should open the edit dialog with correct data when openEditCondoDialog is called and editing is allowed', () => {
    const testCondo: Condo = {
      ID: '2',
      Status: CondoStatus.Vacant,
      OccupantID: 'user1',
      Type: CondoType.Sale,
      UnitNumber: '101',
      Fee: 1000,
      Picture: 'url/to/picture',
      Description: 'Test Condo',
      NumberOfBedrooms: 2,
      NumberOfBathrooms: 1,
      SquareFootage: 1000,
    };

    const loggedInUserInfo = {
      Authority: Authority.Company,
    };

    mockAuthService.getUser.and.returnValue(loggedInUserInfo);
    component.building = {
      ID: '1',
      Year: 2022,
      Name: 'Test Building',
      Address: '123 Main St',
      Bookings: [],
      CompanyID: 'company1',
      Description: 'Lorem ipsum',
      Parkings: [],
      Lockers: [],
      Condos: [],
      Picture: 'url/to/picture',
      Facilities: [],
      Operations:[]
    };
    component.condo = testCondo;
    spyOn(component, 'isEditAllowed').and.returnValue(true);

    component.openEditCondoDialog();
    expect(mockDialog.open).toHaveBeenCalledWith(EditCondoDialogComponent, {
      width: '500px',
      data: jasmine.objectContaining({ condo: testCondo }),
    });
  });

  it('should not open the edit dialog when openEditCondoDialog is called and editing is not allowed', () => {
    const testCondo: Condo = {
      ID: '2',
      Status: CondoStatus.Vacant,
      OccupantID: 'user1',
      Type: CondoType.Sale,
      UnitNumber: '101',
      Fee: 1000,
      Picture: 'url/to/picture',
      Description: 'Test Condo',
      NumberOfBedrooms: 2,
      NumberOfBathrooms: 1,
      SquareFootage: 1000,
    };

    const loggedInUserInfo = {
      Authority: Authority.Public,
    };

    mockAuthService.getUser.and.returnValue(loggedInUserInfo);
    component.building = {
      ID: '1',
      Year: 2022,
      Name: 'Test Building',
      Address: '123 Main St',
      Bookings: [],
      CompanyID: 'company1',
      Description: 'Lorem ipsum',
      Parkings: [],
      Lockers: [],
      Condos: [],
      Picture: 'url/to/picture',
      Facilities: [],
      Operations:[]
    };
    component.condo = testCondo;
    spyOn(component, 'isEditAllowed').and.returnValue(false);

    component.openEditCondoDialog();
    expect(mockDialog.open).not.toHaveBeenCalled();
  });

  it('should fetch building and condo details successfully', async () => {
    const buildingId = '1';
    const condoId = '2';
    const buildingDetails = {
      ID: '1',
      Year: 2022,
      Name: 'Test Building',
      Address: '123 Main St',
      Bookings: [],
      CompanyID: 'company1',
      Description: 'Lorem ipsum',
      Parkings: [],
      Lockers: [],
      Condos: [
        {
          ID: '2',
          Status: CondoStatus.Vacant,
          OccupantID: 'user1',
          Type: CondoType.Sale,
          UnitNumber: '101',
          Fee: 1000,
          Picture: 'url/to/picture',
          Description: 'Test Condo',
          NumberOfBedrooms: 2,
          NumberOfBathrooms: 1,
          SquareFootage: 1000,
        },
      ],
      Picture: 'url/to/picture',
      Facilities: [],
      Operations:[]
    };

    mockBuildingService.getBuilding.and.returnValue(
      Promise.resolve(buildingDetails)
    );

    await component.fetchBuildingAndCondoDetails(buildingId, condoId);

    expect(mockBuildingService.getBuilding).toHaveBeenCalledWith(buildingId);
    expect(component.building).toEqual(buildingDetails);
    expect(component.condo).toEqual(buildingDetails.Condos[0]);
  });

  it('should handle error when fetching building and condo details', async () => {
    const buildingId = '1';
    const condoId = '2';
    const errorMessage = 'Building details not found';

    spyOn(console, 'error');

    await component.fetchBuildingAndCondoDetails(buildingId, condoId);

    expect(mockBuildingService.getBuilding).toHaveBeenCalledWith(buildingId);
    expect(console.error).toHaveBeenCalledWith(errorMessage);
  });

  it('should log a message when share method is called', () => {
    spyOn(console, 'log');
    component.share();
    expect(console.log).toHaveBeenCalledWith('Functionality not implemented yet.');
  });

  it('should close the edit dialog', () => {
    component.closeEditDialog();
    expect(component.editDialogOpen).toBeFalse();
  });

  it('should update condo data when handleCondoEdited is called', () => {
    const updatedCondoData: Condo = {
      ID: '2',
      Status: CondoStatus.Vacant,
      OccupantID: 'user1',
      Type: CondoType.Sale,
      UnitNumber: '101',
      Fee: 1000,
      Picture: 'url/to/picture',
      Description: 'Updated Condo',
      NumberOfBedrooms: 2,
      NumberOfBathrooms: 1,
      SquareFootage: 1000,
    };
  
    component.condo = {
      ID: '2',
      Status: CondoStatus.Vacant,
      OccupantID: 'user1',
      Type: CondoType.Sale,
      UnitNumber: '101',
      Fee: 1000,
      Picture: 'url/to/picture',
      Description: 'Test Condo',
      NumberOfBedrooms: 2,
      NumberOfBathrooms: 1,
      SquareFootage: 1000,
    };
  
    component.handleCondoEdited(updatedCondoData);
  
    expect(component.condo).toEqual(updatedCondoData);
  });
});
