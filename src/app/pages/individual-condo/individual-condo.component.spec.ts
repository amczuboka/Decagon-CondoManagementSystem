import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { IndividualCondoComponent } from './individual-condo.component';
import { UserService } from '../../services/user.service';
import { BuildingService } from '../../services/building.service';
import { of } from 'rxjs';
import {
  Building,
  Condo,
  CondoType,
  CondoStatus,
} from '../../models/properties';
import { Authority } from '../../models/users';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { UserInfoComponent } from './user-info/user-info.component';

describe('IndividualCondoComponent', () => {
  let component: IndividualCondoComponent;
  let fixture: ComponentFixture<IndividualCondoComponent>;
  let mockActivatedRoute: any;
  let mockRouter: any;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockBuildingService: jasmine.SpyObj<BuildingService>;
  let mockMatDialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    mockActivatedRoute = {
      params: of({ buildingId: '1', condoId: '1' }),
    };
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);
    mockUserService = jasmine.createSpyObj('UserService', [
      'getCurrentUserId',
      'getCompanyUser',
      'getPublicUser',
    ]);
    mockBuildingService = jasmine.createSpyObj('BuildingService', [
      'getBuilding',
    ]);
    mockMatDialog = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      declarations: [IndividualCondoComponent, UserInfoComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: UserService, useValue: mockUserService },
        { provide: BuildingService, useValue: mockBuildingService },
        { provide: MatDialog, useValue: mockMatDialog },
      ],
      imports: [MatDialogModule, MatIconModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualCondoComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    mockUserService.getCompanyUser.calls.reset();
    mockUserService.getPublicUser.calls.reset();
    mockBuildingService.getBuilding.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch building and condo details on initialization', waitForAsync(async () => {
    const mockBuilding: Building = {
      ID: '1',
      Name: 'Test Building',
      Year: 2022,
      CompanyID: 'company1',
      Address: '123 Test St',
      Bookings: [],
      Description: 'Test building description',
      Parkings: [],
      Lockers: [],
      Condos: [
        {
          ID: '1',
          UnitNumber: '101',
          Type: CondoType.Sale,
          Status: CondoStatus.Vacant,
          OccupantID: '',
          Fee: 0,
          Picture: '',
          Description: '',
          NumberOfBedrooms: 0,
          NumberOfBathrooms: 0,
          SquareFootage: 0,
        },
      ],
      Picture: '',
      Facilities: [],
    };

    const mockUser = {
      ID: '1',
      Authority: Authority.Company,
      FirstName: 'John',
      LastName: 'Doe',
      Email: 'john.doe@example.com',
      ProfilePicture: 'path/to/profile_picture.jpg',
      PhoneNumber: '1234567890',
      UserName: 'johndoe',
      CompanyName: 'Example Company',
      PropertyIds: ['1', '2'],
      EmployeeIds: ['emp1', 'emp2'],
    };

    // Set up mock return values for services
    mockBuildingService.getBuilding.and.returnValue(
      Promise.resolve(mockBuilding)
    );
    mockUserService.getCurrentUserId.and.returnValue('1');
    mockUserService.getCompanyUser.and.returnValue(Promise.resolve(mockUser));
    mockUserService.getPublicUser.and.returnValue(Promise.resolve(null));

    // Spy on the fetchUserInfo method to track its invocation
    spyOn(component, 'fetchUserInfo').and.callThrough();

    // Trigger change detection and wait for all async tasks to complete
    await fixture.detectChanges();

    // Assert that the methods were called with the correct arguments
    expect(mockBuildingService.getBuilding).toHaveBeenCalledWith('1');
    expect(mockUserService.getCompanyUser).toHaveBeenCalledWith('1');
    expect(mockUserService.getPublicUser).toHaveBeenCalledWith('1');
    expect(component.fetchUserInfo).toHaveBeenCalled(); // Verify that fetchUserInfo was called

    // Wait for fetchUserInfo to complete
    await fixture.whenStable();
    expect(component.userInfo).toEqual(mockUser);

    expect(component.building).toEqual(mockBuilding);
    expect(component.condo).toEqual(mockBuilding.Condos[0]);
  }));

  it('should navigate back when goBack is called', () => {
    component.goBack();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('./condos');
  });

  it('should refresh the component', () => {
    component.refresh();
    expect(mockRouter.navigate).toHaveBeenCalledWith([], {
      relativeTo: mockActivatedRoute,
      replaceUrl: true,
      queryParamsHandling: 'merge',
    });
  });

  it('should handle error when building retrieval fails', async () => {
    mockBuildingService.getBuilding.and.returnValue(Promise.reject('Error'));

    await fixture.detectChanges();

    expect(component.building).toBeNull();
    expect(component.condo).toBeNull();
    expect(component.userInfo).toBeNull();
  });
});
