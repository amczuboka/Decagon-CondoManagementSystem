import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { BuildingInfoComponent } from './building-info.component';
import { MatTabsModule } from '@angular/material/tabs';
import { AppModule } from 'src/app/app.module';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { BuildingService } from 'src/app/services/building.service';
import { Building, Condo, CondoStatus, CondoType, Locker, ParkingLockerStatus, ParkingSpot, ParkingType } from 'src/app/models/properties';

describe('BuildingInfoComponent', () => {
  let component: BuildingInfoComponent;
  let fixture: ComponentFixture<BuildingInfoComponent>;
  let mockActivatedRoute: any;
  let buildingService: BuildingService;
  let consoleErrorSpy: jasmine.Spy;

    // Mock BuildingService.subscribeToBuildingById to return a user
    const updatedBuilding: Building = {
      ID: '1',
      Name: '',
      Address: '',
      Description: '',
      Picture: '',
      Year: 2024,
      CompanyID: '',
      Bookings: [],
      Parkings: [
        { ID: '1', Status: ParkingLockerStatus.Available, OccupantID: '', Number: '', ParkingType: ParkingType.Standard, Fee: 0 },
        { ID: '2', Status: ParkingLockerStatus.Unavailable, OccupantID: '', Number: '', ParkingType: ParkingType.Standard, Fee: 0 },
      ],
      Lockers: [
        { ID: '1', Status: ParkingLockerStatus.Available, OccupantID: '', Number: '', Height: '0', Width: '0', Length: '0', Fee: 0 },
        { ID: '2', Status: ParkingLockerStatus.Unavailable, OccupantID: '', Number: '', Height: '0', Width: '0', Length: '0', Fee: 0 }
      ],
      Condos: [
        { ID: '1', Type: CondoType.Sale, OccupantID: '', UnitNumber: '', Fee: 0, Picture: '', Description: '', NumberOfBedrooms: 0, NumberOfBathrooms: 0, Status: CondoStatus.Vacant, SquareFootage: 0 },
        { ID: '2', Type: CondoType.Sale, OccupantID: '', UnitNumber: '', Fee: 0, Picture: '', Description: '', NumberOfBedrooms: 0, NumberOfBathrooms: 0, Status: CondoStatus.Owned, SquareFootage: 0 },
      ],
      Facilities: []
    };

    let mockBuildingService = {
      subscribeToBuildingById: jasmine.createSpy('subscribeToBuildingById').and.returnValue(of({
        ID: '1',
        Condos: [{ ID: '1', Type: CondoType.Sale, OccupantID: '', UnitNumber: '', Fee: 0, Picture: '', Description: '', NumberOfBedrooms: 0, NumberOfBathrooms: 0, Status: CondoStatus.Vacant, SquareFootage: 0 }],
        Lockers: [{ ID: '1', Status: ParkingLockerStatus.Available, OccupantID: '', Number: '', Height: '0', Width: '0', Length: '0', Fee: 0 }],
        Parkings: [{ ID: '1', Status: ParkingLockerStatus.Available, OccupantID: '', Number: '', ParkingType: ParkingType.Standard, Fee: 0 }]
      }))
    };

  beforeEach(() => {
    mockActivatedRoute = {
      queryParams: of({ building: JSON.stringify({ ID: '1' }) }),
    };
    
    TestBed.configureTestingModule({
      imports: [MatTabsModule, AppModule],
      declarations: [BuildingInfoComponent],
      providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: BuildingService, useValue: mockBuildingService }, 
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(BuildingInfoComponent);
    component = fixture.componentInstance;
    buildingService = TestBed.inject(BuildingService);

    consoleErrorSpy = spyOn(console, 'error');

    fixture.detectChanges();
  });

  afterEach(async () => {
    consoleErrorSpy.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve building information from the route', () => {
    expect(component.building.ID).toEqual('1');
  });

  it('should update condos with new changes', fakeAsync(() => {
    const mockBuilding = {
      Condos: {
        '1': { ID: '1', Type: CondoType.Sale, OccupantID: '', UnitNumber: '', Fee: 0, Picture: '', Description: '', NumberOfBedrooms: 0, NumberOfBathrooms: 0, Status: CondoStatus.Vacant, SquareFootage: 0 }
      }
    };
    mockBuildingService.subscribeToBuildingById.and.returnValue(of(mockBuilding));
  
    component.ngOnInit();
    tick();
  
    expect(component.condos).toEqual([{ ID: '1', Type: CondoType.Sale, OccupantID: '', UnitNumber: '', Fee: 0, Picture: '', Description: '', NumberOfBedrooms: 0, NumberOfBathrooms: 0, Status: CondoStatus.Vacant, SquareFootage: 0 }]);
  }));
  
  it('should update lockers with new changes', fakeAsync(() => {
    const mockBuilding = {
      Lockers: {
        '1': { ID: '1', Status: ParkingLockerStatus.Available, OccupantID: '', Number: '', Height: '0', Width: '0', Length: '0', Fee: 0 }
      }
    };
    mockBuildingService.subscribeToBuildingById.and.returnValue(of(mockBuilding));
  
    component.ngOnInit();
    tick();
  
    expect(component.lockers).toEqual([{ ID: '1', Status: ParkingLockerStatus.Available, OccupantID: '', Number: '', Height: '0', Width: '0', Length: '0', Fee: 0 }]);
  }));
  
  it('should update parkings with new changes', fakeAsync(() => {
    const mockBuilding = {
      Parkings: {
        '1': { ID: '1', Status: ParkingLockerStatus.Available, OccupantID: '', Fee: 0, Number: "0", ParkingType: ParkingType.Standard }
      }
    };

    mockBuildingService.subscribeToBuildingById.and.returnValue(of(mockBuilding));
  
    component.ngOnInit();
    tick();
  
    expect(component.parkings).toEqual([{ ID: '1', Status: ParkingLockerStatus.Available, OccupantID: '', Fee: 0, Number: "0", ParkingType: ParkingType.Standard }]);
  }));

  it('should call console.error when building parameter is not a valid JSON string', () => {
    mockActivatedRoute.queryParams = of({ building: 'not a valid JSON string' });
    component.ngOnInit();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Invalid building parameter', 'Error');
  });
  
  it('should call subscribeToBuildingById with correct parameters', () => {
    component.ngOnInit();
    expect(mockBuildingService.subscribeToBuildingById).toHaveBeenCalledWith('1');
  });
  
  it('should set condos, lockers, and parkings to empty when building parameter is not a valid JSON string', () => {
    mockActivatedRoute.queryParams = of({ building: 'not a valid JSON string' });
    component.ngOnInit();
    expect(component.condos).toEqual([]);
    expect(component.lockers).toEqual([]);
    expect(component.parkings).toEqual([]);
  });
  
  it('should update condos, lockers, and parkings correctly when subscribeToBuildingById returns a valid building object', () => {
    mockBuildingService.subscribeToBuildingById.and.returnValue(of(updatedBuilding));

    component.ngOnInit();
    expect(component.condos).toEqual(updatedBuilding.Condos.filter((condo: Condo) => condo.Status === 'Vacant'));
    expect(component.lockers).toEqual(updatedBuilding.Lockers.filter((locker: Locker) => locker.Status === 'Available'));
    expect(component.parkings).toEqual(updatedBuilding.Parkings.filter((parking: ParkingSpot) => parking.Status === 'Available'));
  });

  it('should set condos, lockers, and parkings to empty when subscribeToBuildingById returns null', () => {
    mockBuildingService.subscribeToBuildingById.and.returnValue(of(null));
  
    component.ngOnInit();
  
    expect(component.condos).toEqual([]);
    expect(component.lockers).toEqual([]);
    expect(component.parkings).toEqual([]);
  });
});