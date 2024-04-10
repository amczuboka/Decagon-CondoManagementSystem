import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  Building,
  CondoStatus,
  CondoType,
  ParkingLockerStatus,
  ParkingType,
  Facilities,
} from 'src/app/models/properties';
import { BuildingOverviewComponent } from './building-overview.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AppModule } from 'src/app/app.module';

describe('BuildingOverviewComponent', () => {
  let component: BuildingOverviewComponent;
  let fixture: ComponentFixture<BuildingOverviewComponent>;

  beforeEach(() => {
    
    TestBed.configureTestingModule({
      imports: [
        AppModule,
        MatDividerModule,  
        MatCardModule, 
        MatIconModule,
        ],
      declarations: [BuildingOverviewComponent]
    });
    fixture = TestBed.createComponent(BuildingOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('calculateTotalCondos', () => {
    it('should return the total number of condos in the building', () => {
      const building: Building = {
        ID: '1',
        Name: 'Building A',
        Year: 2001,
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
            ID: 'condo3',
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
          {
            ID: 'condo4',
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
          {
            ID: 'condo5',
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
        Operations:[]
      };

      const totalCondos = component.calculateTotalCondos(building);

      expect(totalCondos).toEqual(5);
    });
  });

  describe('calculateAvailableCondos', () => {
    it('should return the number of available condos in the building', () => {
      const building: Building = {
        ID: '1',
        Name: 'Building A',
        Year: 2001,
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
            ID: 'condo3',
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
          {
            ID: 'condo4',
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
          {
            ID: 'condo5',
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
        Operations:[]
      };

      const availableCondos = component.calculateAvailableCondos(building);

      expect(availableCondos).toEqual(3);
    });
  });


  describe('calculateTotalParkings', () => {
    it('should return the total number of parking spots in the building', () => {
      const building: Building = {
        ID: '1',
        Name: 'Building A',
        Year: 2001,
        CompanyID: '',
        Address: '',
        Bookings: [],
        Description: '',
        Parkings: [
          { 
            ID:'P1',
            OccupantID: '',
            Number: '',
            Status: ParkingLockerStatus.Available,
            ParkingType: ParkingType.Standard,
            Fee: 0,
          },
          { 
            ID:'P2',
            OccupantID: '',
            Number: '',
            Status: ParkingLockerStatus.Available,
            ParkingType: ParkingType.Standard,
            Fee: 0,
          },
          { 
            ID:'P3',
            OccupantID: '',
            Number: '',
            Status: ParkingLockerStatus.Unavailable,
            ParkingType: ParkingType.Standard,
            Fee: 0,
          }
        ],
        Lockers: [],
        Condos: [],
        Picture: '',
        Facilities: [],
        Operations:[]
      };

      const totalParkingSpots = component.calculateTotalParkings(building);

      expect(totalParkingSpots).toEqual(3);
    });
  });

  describe('calculateAvailableParkings', () => {
    it('should return number of available parking spots in the building', () => {
      const building: Building = {
        ID: '1',
        Name: 'Building A',
        Year: 2001,
        CompanyID: '',
        Address: '',
        Bookings: [],
        Description: '',
        Parkings: [
          { 
            ID:'P1',
            OccupantID: '',
            Number: '',
            Status: ParkingLockerStatus.Available,
            ParkingType: ParkingType.Standard,
            Fee: 0,
          },
          { 
            ID:'P2',
            OccupantID: '',
            Number: '',
            Status: ParkingLockerStatus.Available,
            ParkingType: ParkingType.Standard,
            Fee: 0,
          },
          { 
            ID:'P3',
            OccupantID: '',
            Number: '',
            Status: ParkingLockerStatus.Unavailable,
            ParkingType: ParkingType.Standard,
            Fee: 0,
          }
        ],
        Lockers: [],
        Condos: [],
        Picture: '',
        Facilities: [],
        Operations:[]
      };

      const availableParkingSpots = component.calculateAvailableParkings(building);

      expect(availableParkingSpots).toEqual(2);
    });
  });

  describe('calculateTotalLockers', () => {
    it('should return the total number of lockers in the building', () => {
      const building: Building = {
        ID: '1',
        Name: 'Building A',
        Year: 2001,
        CompanyID: '',
        Address: '',
        Bookings: [],
        Description: '',
        Parkings: [],
        Lockers: [
          {
            ID: 'L1',
            OccupantID: '',
            Number: '',
            Status: ParkingLockerStatus.Available,
            Height: '',
            Width: '',
            Length: '',
            Fee: 0,
          },
          {
            ID: 'L2',
            OccupantID: '',
            Number: '',
            Status: ParkingLockerStatus.Available,
            Height: '',
            Width: '',
            Length: '',
            Fee: 0,
          },
          {
            ID: 'L3',
            OccupantID: '',
            Number: '',
            Status: ParkingLockerStatus.Unavailable,
            Height: '',
            Width: '',
            Length: '',
            Fee: 0,
          },
        ],
        Condos: [],
        Picture: '',
        Facilities: [],
        Operations:[]
      };

      const totalLockers = component.calculateTotalLockers(building);

      expect(totalLockers).toEqual(3);
    });
  });

  describe('calculateAvailableLockers', () => {
    it('should return the number of available lockers in the building', () => {
      const building: Building = {
        ID: '1',
        Name: 'Building A',
        Year: 2001,
        CompanyID: '',
        Address: '',
        Bookings: [],
        Description: '',
        Parkings: [],
        Lockers: [
          {
            ID: 'L1',
            OccupantID: '',
            Number: '',
            Status: ParkingLockerStatus.Available,
            Height: '',
            Width: '',
            Length: '',
            Fee: 0,
          },
          {
            ID: 'L2',
            OccupantID: '',
            Number: '',
            Status: ParkingLockerStatus.Available,
            Height: '',
            Width: '',
            Length: '',
            Fee: 0,
          },
          {
            ID: 'L3',
            OccupantID: '',
            Number: '',
            Status: ParkingLockerStatus.Unavailable,
            Height: '',
            Width: '',
            Length: '',
            Fee: 0,
          },
        ],
        Condos: [],
        Picture: '',
        Facilities: [],
        Operations:[]
      };

      const availableLockers = component.calculateAvailableLockers(building);

      expect(availableLockers).toEqual(2);
    });
  });

  //Testing getter function to display facility icons
  describe('getFacilityIcon', () => {
    it('should return correct icon for each facility', () => {
      expect(component.getFacilityIcon(Facilities.Gym)).toEqual('fitness_center');
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

  describe('fetchCompany', () => {
    it('should fetch company object on ngOnInit', () => {
      spyOn(component,'fetchCompany');
      component.ngOnInit();
      expect(component.fetchCompany).toHaveBeenCalled();
    });

    
  });




});
