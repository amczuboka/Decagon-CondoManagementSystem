import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { BuildingComponent } from './building.component';
import { AppModule } from 'src/app/app.module';
import {
  Building,
  CondoStatus,
  CondoType,
  Facilities,
  sourcePage,
} from 'src/app/models/properties';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { BuildingService } from 'src/app/services/building.service';
import { Authority } from 'src/app/models/users';
import { BehaviorSubject, of } from 'rxjs';

describe('BuildingComponent', () => {
  let component: BuildingComponent;
  let fixture: ComponentFixture<BuildingComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockBuildingService: jasmine.SpyObj<BuildingService>;


  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj(['getUser']);
    mockBuildingService = jasmine.createSpyObj('BuildingService', ['subscribeToBuildings']);
    mockBuildingService.buildingsSubject = new BehaviorSubject<Building[] | null>(null);
    mockBuildingService.buildings$ = mockBuildingService.buildingsSubject.asObservable();

    await TestBed.configureTestingModule({
      imports: [ AppModule],
      declarations: [BuildingComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: BuildingService, useValue: mockBuildingService },
      ],
    }).compileComponents();
  
    fixture = TestBed.createComponent(BuildingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch the current user and set authority', fakeAsync(() => {
    const user = { uid: '1', photoURL: Authority.Company };
    mockAuthService.getUser.and.returnValue(Promise.resolve(user));
    
    const buildings: Building[] | null = []; 
    mockBuildingService.buildingsSubject.next(buildings); 
    
    component.ngOnInit();
    tick();
    
    expect(mockAuthService.getUser).toHaveBeenCalled();
    expect(component.myUser).toEqual(user);
    expect(component.authority).toEqual(user.photoURL);
  }));

  it('should handle null buildings array', fakeAsync(() => {
    const user = { uid: '1', photoURL: Authority.Company };
    mockAuthService.getUser.and.returnValue(Promise.resolve(user));

    const buildings = null; // Create an observable
    mockBuildingService.buildingsSubject.next(buildings); 
  
    component.ngOnInit();
    tick();

    expect(component.buildings).toEqual([]);
  }));

  it('should handle availablePage sourcePage', fakeAsync(() =>  {
    mockBuildingService.buildings$ = of([
      { ID: 'building1', Name: '', Year: 0, CompanyID: '', Address: '', Bookings: [], Description: '', Parkings: [], Lockers: [], Condos: [], Picture: '', Facilities: [] },
      { ID: 'building2', Name: '', Year: 0, CompanyID: '', Address: '', Bookings: [], Description: '', Parkings: [], Lockers: [], Condos: [], Picture: '', Facilities: [] }
    ]);    

    component.sourcePage = sourcePage.availablePage;
    component.ngOnInit();
    tick();

    expect(component.buildings).toEqual([ { ID: 'building1', Name: '', Year: 0, CompanyID: '', Address: '', Bookings: [], Description: '', Parkings: [], Lockers: [], Condos: [], Picture: '', Facilities: [] },
    { ID: 'building2', Name: '', Year: 0, CompanyID: '', Address: '', Bookings: [], Description: '', Parkings: [], Lockers: [], Condos: [], Picture: '', Facilities: [] }]);
  }));

  it('should handle propertiesPage sourcePage with Company authority', fakeAsync(() => {
    mockBuildingService.buildings$ = of([
      { ID: 'building1', Name: '', Year: 0, CompanyID: 'uid1', Address: '', Bookings: [], Description: '', Parkings: [], Lockers: [], Condos: [], Picture: '', Facilities: [] },
      { ID: 'building2', Name: '', Year: 0, CompanyID: '', Address: '', Bookings: [], Description: '', Parkings: [], Lockers: [], Condos: [], Picture: '', Facilities: [] }
    ]);
    component.sourcePage = sourcePage.propertiesPage;
    component.authority = Authority.Company;
    const user = { uid: 'uid1', photoURL: Authority.Company };
    mockAuthService.getUser.and.returnValue(Promise.resolve(user));

    component.ngOnInit();
    tick();

    expect(component.buildings).toEqual([ { ID: 'building1', Name: '', Year: 0, CompanyID: 'uid1', Address: '', Bookings: [], Description: '', Parkings: [], Lockers: [], Condos: [], Picture: '', Facilities: [] }]);
  }));

  it('should handle propertiesPage sourcePage with Public authority', fakeAsync(() => {
    mockBuildingService.buildings$ = of([
      { ID: 'building1', Name: '', Year: 0, CompanyID: '', Address: '', Bookings: [], Description: '', Parkings: [], Lockers: [], Condos: [], Picture: '', Facilities: [] },
      { ID: 'building2', Name: '', Year: 0, CompanyID: '', Address: '', Bookings: [], Description: '', Parkings: [], Lockers: [], Condos: [], Picture: '', Facilities: [] }
    ]);
    component.sourcePage = sourcePage.propertiesPage;
    component.authority = Authority.Public;
    component.myUser = { uid: 'uid1' };

    component.ngOnInit();
    tick();

    expect(component.buildings).toEqual([]);
  }));

  it('should handle propertiesPage sourcePage with other authority', fakeAsync(() =>  {
    mockBuildingService.buildings$ = of([
      { ID: 'building1', Name: '', Year: 0, CompanyID: '', Address: '', Bookings: [], Description: '', Parkings: [], Lockers: [], Condos: [], Picture: '', Facilities: [] },
      { ID: 'building2', Name: '', Year: 0, CompanyID: '', Address: '', Bookings: [], Description: '', Parkings: [], Lockers: [], Condos: [], Picture: '', Facilities: [] }
    ]);    component.sourcePage = sourcePage.propertiesPage;

    component.authority = 'Other';
    component.ngOnInit();
    tick();

    expect(component.buildings).toEqual([]);
  }));

  it('should handle other sourcePage', fakeAsync(() => {
    mockBuildingService.buildings$ = of([
      { ID: 'building1', Name: '', Year: 0, CompanyID: '', Address: '', Bookings: [], Description: '', Parkings: [], Lockers: [], Condos: [], Picture: '', Facilities: [] },
      { ID: 'building2', Name: '', Year: 0, CompanyID: '', Address: '', Bookings: [], Description: '', Parkings: [], Lockers: [], Condos: [], Picture: '', Facilities: [] }
    ]);
    component.sourcePage = 'Other';
    component.ngOnInit();
    tick();

    expect(component.buildings).toEqual([]);
  }));

  it('should handle null user', fakeAsync(() => {
    mockAuthService.getUser.and.returnValue(Promise.resolve(null));
  
    const buildings: Building[] | null = []; 
    mockBuildingService.buildingsSubject.next(buildings); 
  
    component.ngOnInit();
    tick();
  
    expect(mockAuthService.getUser).toHaveBeenCalled();
    expect(component.myUser).toBeNull();
    expect(component.authority).toBeUndefined();
  }));

  describe('onSearchTextEntered', () => {
    it('should update searchText when search text is entered', () => {
      const searchValue = 'testSearchValue';

      component.onSearchTextEntered(searchValue);

      expect(component.searchText).toEqual(searchValue);
    });
  });

  describe('getFacilityIcon', () => {
    it('should return correct icon for each facility', () => {
      expect(component.getFacilityIcon(Facilities.Gym)).toEqual(
        'fitness_center'
      );
      expect(component.getFacilityIcon(Facilities.Pool)).toEqual('pool');
      expect(component.getFacilityIcon(Facilities.Spa)).toEqual('spa');
      expect(component.getFacilityIcon(Facilities.Parking)).toEqual('local_parking');
      expect(component.getFacilityIcon(Facilities.Locker)).toEqual('locker');
      expect(component.getFacilityIcon(Facilities.Playground)).toEqual('child_friendly');
      expect(component.getFacilityIcon(Facilities.MeetingRoom)).toEqual('meeting_room');
    });

    it('should return default icon for undefined facility', () => {
      const facility = 'UndefinedFacility';
      const result = component.getFacilityIcon(facility);
      expect(result).toEqual('');
    });
  });

  describe('Naviguation', () => {
    let router: Router;

    beforeEach(() => {
      router = TestBed.inject(Router);
      mockAuthService = jasmine.createSpyObj(['getUser']);
      mockBuildingService = jasmine.createSpyObj(['subscribeToBuildingById']);
    });

    it('should navigate to building-info page with the selected building as a query parameter', () => {
      const item: Building = {
        ID: '1',
        Name: 'Building 1',
        Year: 0,
        CompanyID: '',
        Address: '',
        Bookings: [],
        Description: '',
        Parkings: [],
        Lockers: [],
        Condos: [],
        Picture: '',
        Facilities: [],
      };
      component.sourcePage = 'availablePage'; // Define the sourcePage property
      const queryParams = {
        building: JSON.stringify(item),
        sourcePage: component.sourcePage,
      };
      const navigateSpy = spyOn(router, 'navigate').and.returnValue(
        Promise.resolve(true)
      );

      component.navigateToBuildingInfo(item);

      expect(navigateSpy).toHaveBeenCalledWith(['/building-info'], {
        queryParams,
      });
    });
  });

  describe('calculateTotalCondos', () => {
    it('should return the total number of condos in the building', () => {
      const building: Building = {
        ID: '1',
        Name: 'Building 1',
        Year: 0,
        CompanyID: '',
        Address: '',
        Bookings: [],
        Description: '',
        Parkings: [],
        Lockers: [],
        Condos: [
          {
            ID: 'condo1',
            Status: CondoStatus.Rented,
            Type: CondoType.Rent,
            OccupantID: '',
            UnitNumber: '',
            Fee: 0,
            Picture: '',
            Description: '',
            NumberOfBedrooms: 0,
            NumberOfBathrooms: 0,
            SquareFootage: 0,
          },
          {
            ID: 'condo2',
            Status: CondoStatus.Vacant,
            Type: CondoType.Rent,
            OccupantID: '',
            UnitNumber: '',
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

      const totalCondos = component.calculateTotalCondos(building);

      expect(totalCondos).toEqual(2);
    });
  });

  describe('calculateAvailableCondos', () => {
    it('should return the number of available condos in the building', () => {
      const building: Building = {
        ID: '1',
        Name: 'Building 1',
        Year: 0,
        CompanyID: '',
        Address: '',
        Bookings: [],
        Description: '',
        Parkings: [],
        Lockers: [],
        Condos: [
          {
            ID: 'condo1',
            Status: CondoStatus.Rented,
            Type: CondoType.Rent,
            OccupantID: '',
            UnitNumber: '',
            Fee: 0,
            Picture: '',
            Description: '',
            NumberOfBedrooms: 0,
            NumberOfBathrooms: 0,
            SquareFootage: 0,
          },
          {
            ID: 'condo2',
            Status: CondoStatus.Vacant,
            Type: CondoType.Rent,
            OccupantID: '',
            UnitNumber: '',
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

      const availableCondos = component.calculateAvailableCondos(building);

      expect(availableCondos).toEqual(1);
    });
  });

  it('should return 0 for total condos when building has no condos', () => {
    const building: Building = {
      Condos: [],
      ID: '',
      Year: 0,
      CompanyID: '',
      Name: '',
      Address: '',
      Bookings: [],
      Description: '',
      Parkings: [],
      Lockers: [],
      Picture: '',
      Facilities: []
    }; 
    const result = component.calculateTotalCondos(building);
    expect(result).toEqual(0);
  });
  
  it('should return 0 for available condos when building has no condos', () => {
    const building: Building = {
      Condos: [],
      ID: '',
      Year: 0,
      CompanyID: '',
      Name: '',
      Address: '',
      Bookings: [],
      Description: '',
      Parkings: [],
      Lockers: [],
      Picture: '',
      Facilities: []
    }; 
    const result = component.calculateAvailableCondos(building);
    expect(result).toEqual(0);
  });

  it('should return total condos but 0 available condos when building has condos but none are available', () => {
    const building: Building = {
      Condos: [
        { ID: 'condo1', Status: CondoStatus.Rented, Type: CondoType.Rent, OccupantID: '', UnitNumber: '', Fee: 0, Picture: '', Description: '', NumberOfBedrooms: 0, NumberOfBathrooms: 0, SquareFootage: 0 },
        { ID: 'condo2', Status: CondoStatus.Owned, Type: CondoType.Rent, OccupantID: '', UnitNumber: '', Fee: 0, Picture: '', Description: '', NumberOfBedrooms: 0, NumberOfBathrooms: 0, SquareFootage: 0 },
      ],      ID: '',
      Year: 0,
      CompanyID: '',
      Name: '',
      Address: '',
      Bookings: [],
      Description: '',
      Parkings: [],
      Lockers: [],
      Picture: '',
      Facilities: []
    }; 
    const totalCondos = component.calculateTotalCondos(building);
    const availableCondos = component.calculateAvailableCondos(building);
    expect(totalCondos).toEqual(2);
    expect(availableCondos).toEqual(0);
  });
});