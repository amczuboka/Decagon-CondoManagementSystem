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

describe('IndividualCondoComponent', () => {
  let component: IndividualCondoComponent;
  let fixture: ComponentFixture<IndividualCondoComponent>;
  let mockActivatedRoute;
  let mockRouter: any;
  let mockUserService: any;
  let mockBuildingService: any;
  let mockDialog: any;

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

    await TestBed.configureTestingModule({
      declarations: [IndividualCondoComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: UserService, useValue: mockUserService },
        { provide: BuildingService, useValue: mockBuildingService },
        { provide: MatDialog, useValue: mockDialog },
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

  it('should call navigateByUrl with "./condos" when goBack is called', () => {
    component.goBack();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('./condos');
  });

  it('should open the edit dialog with correct data when openEditCondoDialog is called', () => {
    const testCondo: Condo = {
      ID: '2',
      Status: CondoStatus.Owned,
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
    component.condo = testCondo;
    component.openEditCondoDialog();
    expect(mockDialog.open).toHaveBeenCalledWith(EditCondoDialogComponent, {
      width: '500px',
      data: jasmine.objectContaining({ condo: testCondo }),
    });
  });

  it('should update condo on dialog close', (done) => {
    const initialCondo: Condo = {
      ID: '2',
      Status: CondoStatus.Owned,
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
    const updatedCondo: Condo = { ...initialCondo, Status: CondoStatus.Rented };

    mockDialog.open.and.returnValue({ afterClosed: () => of(updatedCondo) });
    component.condo = initialCondo;
    component.openEditCondoDialog();

    fixture.whenStable().then(() => {
      expect(component.condo).toEqual(updatedCondo);
      done();
    });
  });
});
