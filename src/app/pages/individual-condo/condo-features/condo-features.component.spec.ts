import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { CondoFeaturesComponent } from './condo-features.component';
import {
  Condo,
  Building,
  CondoType,
  CondoStatus,
} from '../../../models/properties';

describe('CondoFeaturesComponent', () => {
  let component: CondoFeaturesComponent;
  let fixture: ComponentFixture<CondoFeaturesComponent>;
  let mockCondo: Condo;
  let mockBuilding: Building;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CondoFeaturesComponent],
      imports: [MatIconModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CondoFeaturesComponent);
    component = fixture.componentInstance;

    // Initialize mock data
    mockCondo = {
      NumberOfBedrooms: 2,
      NumberOfBathrooms: 1,
      SquareFootage: 1200,
      UnitNumber: '101',
      Fee: 1000,
      Picture: 'condo.jpg',
      Description: 'Spacious condo with great amenities',
      ID: '1',
      Type: CondoType.Sale,
      OccupantID: '1',
      Status: CondoStatus.Vacant,
    };

    mockBuilding = {
      Year: 1999,
      Name: 'Example Building',
      Address: '123 Main St',
      ID: '1',
      CompanyID: '1',
      Bookings: [],
      Description: 'A great building with many amenities.',
      Parkings: [],
      Lockers: [],
      Condos: [],
      Picture: '',
      Facilities: [],
      Operations:[]
    };
    component.condo = mockCondo;
    component.building = mockBuilding;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
