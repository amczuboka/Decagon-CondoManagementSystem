import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { BuildingInfoComponent } from './building-info.component';
import { AuthService } from 'src/app/services/auth.service';
import { BuildingService } from 'src/app/services/building.service';
import { MatTabsModule } from '@angular/material/tabs';
import { AppModule } from 'src/app/app.module';
import {
  Building,
  CondoStatus,
  CondoType,
  ParkingLockerStatus,
  ParkingType,
  sourcePage,
} from 'src/app/models/properties';
import { Authority } from 'src/app/models/users';

describe('BuildingInfoComponent', () => {
  let component: BuildingInfoComponent;
  let fixture: ComponentFixture<BuildingInfoComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockBuildingService: jasmine.SpyObj<BuildingService>;
  let mockActivatedRoute: any;
  let building: Building;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj(['getUser']);
    mockBuildingService = jasmine.createSpyObj(['subscribeToBuildingById']);
    mockActivatedRoute = {
      queryParams: of({ building: '{}', sourcePage: 'sourcePage' }),
    };

    building = {
      ID: '1',
      Year: 2022,
      CompanyID: 'company1',
      Name: 'Building 1',
      Condos: [],
      Lockers: [],
      Parkings: [],
      Address: '',
      Description: '',
      Picture: '',
      Bookings: [],
      Facilities: [],
      Operations:[]
    };

    await TestBed.configureTestingModule({
      imports: [MatTabsModule, AppModule],
      declarations: [BuildingInfoComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: BuildingService, useValue: mockBuildingService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    mockBuildingService.subscribeToBuildingById.and.returnValue(of(null));
    fixture = TestBed.createComponent(BuildingInfoComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle valid queryParams', fakeAsync(() => {
    mockActivatedRoute.queryParams = of({
      building: JSON.stringify(building),
      sourcePage: 'sourcePage',
    });
    component.ngOnInit();
    tick();
    expect(component.building).toEqual(building);
    expect(component.sourcePage).toBe('sourcePage');
  }));

  it('should handle sourcePage propertiesPage and authority Company', fakeAsync(() => {
    mockActivatedRoute.queryParams = of({
      building: JSON.stringify(building),
      sourcePage: 'propertiesPage',
    });
    mockAuthService.getUser.and.returnValue(
      Promise.resolve({ photoURL: 'Company' })
    );

    mockBuildingService.subscribeToBuildingById.and.returnValue(of(building));

    component.ngOnInit();
    tick();
    expect(component.building).toEqual(building);
    expect(component.condos).toEqual(building.Condos);
    expect(component.lockers).toEqual(building.Lockers);
    expect(component.parkings).toEqual(building.Parkings);
    expect(component.sourcePage).toBe('propertiesPage');
    expect(component.myUser.photoURL).toBe('Company');
  }));

  it('should handle sourcePage propertiesPage and authority Public', fakeAsync(() => {
    const mockBuilding: Building = {
      ID: 'testID',
      Year: 2022,
      CompanyID: 'company1',
      Name: 'Building 1',
      Condos: [
        { ID: 'condo1', Status: CondoStatus.Rented, Type: CondoType.Rent, OccupantID: '1', UnitNumber: '', Fee: 0, Picture: '', Description: '', NumberOfBedrooms: 0, NumberOfBathrooms: 0, SquareFootage: 0 },
        { ID: 'condo2', Status: CondoStatus.Vacant, Type: CondoType.Rent, OccupantID: '', UnitNumber: '', Fee: 0, Picture: '', Description: '', NumberOfBedrooms: 0, NumberOfBathrooms: 0, SquareFootage: 0 },
      ],
      Lockers: [
        { ID: 'locker1', OccupantID: '1', Status: ParkingLockerStatus.Available, Number: '', Fee: 0, Height: '', Width: '', Length: '' },
        { ID: 'locker2', OccupantID: '', Status: ParkingLockerStatus.Unavailable, Number: '', Fee: 0, Height: '', Width: '', Length: '' },
      ],
      Parkings: [
        { ID: 'parking1', OccupantID: '1', Number: '', Status: ParkingLockerStatus.Available, ParkingType: ParkingType.Standard, Fee: 0 },
        { ID: 'parking2', OccupantID: '', Number: '', Status: ParkingLockerStatus.Unavailable, ParkingType: ParkingType.Standard, Fee: 0 },
      ],
      Address: '',
      Description: '',
      Picture: '',
      Bookings: [],
      Facilities: [],
      Operations:[]
    };

    mockActivatedRoute.queryParams = of({
      building: JSON.stringify(mockBuilding),
      sourcePage: 'propertiesPage',
    });
    
    const user = { uid: '1', photoURL: 'Public' };
    mockAuthService.getUser.and.returnValue(Promise.resolve(user));
    
    mockAuthService.getUser.and.returnValue(
      Promise.resolve(user)
    );

    mockBuildingService.subscribeToBuildingById.and.returnValue(of(mockBuilding));

    const expectedCondosLength = mockBuilding.Condos.filter(condo => condo.OccupantID === user.uid).length;
    const expectedLockersLength = mockBuilding.Lockers.filter(locker => locker.OccupantID === user.uid).length;
    const expectedParkingsLength = mockBuilding.Parkings.filter(parking => parking.OccupantID === user.uid).length;

    component.ngOnInit();
    tick();
    expect(component.building).toEqual(mockBuilding);
    expect(component.condos.length).toEqual(expectedCondosLength);
    expect(component.lockers.length).toEqual(expectedLockersLength);
    expect(component.parkings.length).toEqual(expectedParkingsLength);
    expect(component.sourcePage).toBe('propertiesPage');
    expect(component.myUser.photoURL).toBe('Public');
    expect(component.myUser).toEqual(user);
  }));

  it('should handle sourcePage availablePage and authority Company', fakeAsync(() => {
    const updatedBuilding = {
      ...building,
    };

    mockActivatedRoute.queryParams = of({
      building: JSON.stringify(updatedBuilding),
      sourcePage: 'availablePage',
    });

    mockAuthService.getUser.and.returnValue(
      Promise.resolve({ photoURL: 'Company' })
    );

    mockBuildingService.subscribeToBuildingById.and.returnValue(of(updatedBuilding));

    component.ngOnInit();
    tick();
    expect(component.building).toEqual(updatedBuilding);
    expect(component.sourcePage).toBe('availablePage');
    expect(component.myUser.photoURL).toBe('Company');
    expect(component.condos).toEqual(updatedBuilding.Condos);
    expect(component.lockers).toEqual(updatedBuilding.Lockers);
    expect(component.parkings).toEqual(updatedBuilding.Parkings);
  }));

  it('should handle sourcePage availablePage and authority Public', fakeAsync(() => {
    const updatedBuilding = {
      ...building,
    };

    mockActivatedRoute.queryParams = of({
      building: JSON.stringify(building),
      sourcePage: 'availablePage',
    });

    mockAuthService.getUser.and.returnValue(
      Promise.resolve({ photoURL: 'Public' })
    );

    mockBuildingService.subscribeToBuildingById.and.returnValue(
      of(updatedBuilding)
    );

    component.ngOnInit();
    tick();

    expect(component.building).toEqual(building);
    expect(component.sourcePage).toBe('availablePage');
    expect(component.myUser.photoURL).toBe('Public');
    expect(component.condos).toEqual(updatedBuilding.Condos);
    expect(component.lockers).toEqual(updatedBuilding.Lockers);
    expect(component.parkings).toEqual(updatedBuilding.Parkings);
  }));

  it('should set condos, lockers, and parkings to empty arrays if sourcePage is propertiesPage and authority is null', fakeAsync(() => {
    mockBuildingService.subscribeToBuildingById.and.returnValue(of(building));
    component.sourcePage = sourcePage.propertiesPage;
    component.authority = '';

    component.ngOnInit();
    tick();

    expect(component.condos).toEqual(building.Condos);
    expect(component.lockers).toEqual(building.Lockers);
    expect(component.parkings).toEqual(building.Parkings);
    expect(component.authority).toEqual('');
  }));

  it('should handle updatedBuilding with Condos, Lockers, and Parkings', fakeAsync(() => {
    const updatedBuilding: Building = {
      ID: '2',
      Year: 2023,
      CompanyID: 'company2',
      Name: 'Building 1',
      Condos: [],
      Lockers: [],
      Parkings: [],
      Address: '',
      Description: '',
      Picture: '',
      Bookings: [],
      Facilities: [],
      Operations:[]
    };
    mockActivatedRoute.queryParams = of({
      building: JSON.stringify(building),
      sourcePage: 'sourcePage',
    });
    mockBuildingService.subscribeToBuildingById.and.returnValue(
      of(updatedBuilding)
    );
    component.ngOnInit();
    tick();
    expect(component.building).toEqual(updatedBuilding);
  }));

  it('should handle myUser with uid', fakeAsync(() => {
    const user = { uid: '1' };
    mockAuthService.getUser.and.returnValue(Promise.resolve(user));
    component.ngOnInit();
    tick();
    expect(component.myUser).toEqual(user);
  }));

  it('should fetch the current user', fakeAsync(() => {
    const user = { photoURL: 'test' };
    mockAuthService.getUser.and.returnValue(Promise.resolve(user));

    component.ngOnInit();
    tick();

    expect(mockAuthService.getUser).toHaveBeenCalled();
    expect(component.authority).toBe(user.photoURL);
  }));

  it('should call authService.getUser on ngOnInit', fakeAsync(() => {
    mockAuthService.getUser.and.returnValue(Promise.resolve(null));
    component.ngOnInit();
    tick();
    expect(mockAuthService.getUser).toHaveBeenCalled();
    expect(component.authority).toBeUndefined();
  }));

  it('should call buildingService.subscribeToBuildingById with correct building ID', fakeAsync(() => {
    const mockBuilding = { ID: 'testID' };
    mockActivatedRoute.queryParams = of({
      building: JSON.stringify(mockBuilding),
      sourcePage: 'sourcePage',
    });
    component.ngOnInit();
    tick(); 
    expect(mockBuildingService.subscribeToBuildingById).toHaveBeenCalledWith(
      mockBuilding.ID
    );
  }));

  it('should filter condos, lockers, and parkings when sourcePage is availablePage', fakeAsync(() => {
    const mockUser = { photoURL: 'testURL' };

    mockAuthService.getUser.and.returnValue(Promise.resolve(mockUser));

    const mockBuilding: Building = {
      ID: 'testID',
      Year: 2022,
      CompanyID: 'company1',
      Name: 'Building 1',
      Condos: [
        { ID: 'condo1', Status: CondoStatus.Rented, Type: CondoType.Rent, OccupantID: '', UnitNumber: '', Fee: 0, Picture: '', Description: '', NumberOfBedrooms: 0, NumberOfBathrooms: 0, SquareFootage: 0 },
        { ID: 'condo2', Status: CondoStatus.Vacant, Type: CondoType.Rent, OccupantID: '', UnitNumber: '', Fee: 0, Picture: '', Description: '', NumberOfBedrooms: 0, NumberOfBathrooms: 0, SquareFootage: 0 },
      ],
      Lockers: [
        { ID: 'locker1', OccupantID: '', Status: ParkingLockerStatus.Available, Number: '', Fee: 0, Height: '', Width: '', Length: '' },
        { ID: 'locker2', OccupantID: '', Status: ParkingLockerStatus.Unavailable, Number: '', Fee: 0, Height: '', Width: '', Length: '' },
      ],
      Parkings: [
        { ID: 'parking1', OccupantID: '', Number: '', Status: ParkingLockerStatus.Available, ParkingType: ParkingType.Standard, Fee: 0 },
        { ID: 'parking2', OccupantID: '', Number: '', Status: ParkingLockerStatus.Unavailable, ParkingType: ParkingType.Standard, Fee: 0 },
      ],
      Address: '',
      Description: '',
      Picture: '',
      Bookings: [],
      Facilities: [],
      Operations:[]
    };
    mockActivatedRoute.queryParams = of({
      building: JSON.stringify(mockBuilding),
      sourcePage: sourcePage.availablePage,
    });
    mockBuildingService.subscribeToBuildingById.and.returnValue(
      of(mockBuilding)
    );
    component.ngOnInit();
    tick();
    expect(component.condos.length).toBe(1);
    expect(component.lockers.length).toBe(1);
    expect(component.parkings.length).toBe(1);
    expect(component.authority).toEqual(mockUser.photoURL);
  }));

  it('should set authority to user photoURL when authService.getUser() returns a user', fakeAsync(() => {
    const user = { uid: '1', photoURL: 'user-photo-url' };
    mockAuthService.getUser.and.returnValue(Promise.resolve(user));

    mockActivatedRoute.queryParams = of({
      building: JSON.stringify(building),
      sourcePage: sourcePage.availablePage,
    });

    component.ngOnInit();
    tick();

    expect(component.myUser).toEqual(user);
    expect(component.authority).toEqual(user.photoURL);
    expect(component.sourcePage).toBe('availablePage');
  }));

  it('should handle null return from subscribeToBuildingById', fakeAsync(() => {
    const user = { uid: '1', photoURL: Authority.Company };
  
    mockActivatedRoute.queryParams = of({
      building: JSON.stringify(building),
      sourcePage: sourcePage.availablePage,
    });
  
    mockAuthService.getUser.and.returnValue(Promise.resolve(user));
    mockBuildingService.subscribeToBuildingById.and.returnValue(of(null));
  
    component.ngOnInit();
    tick();
  
    expect(mockAuthService.getUser).toHaveBeenCalled();
    expect(mockBuildingService.subscribeToBuildingById).toHaveBeenCalledWith(building.ID);
    expect(component.building).toEqual(building);
  }));
});
