import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { CondoFeaturesComponent } from './condo-features.component';
import { CondoDTO, BuildingDTO } from '../../../models/properties';

describe('CondoFeaturesComponent', () => {
  let component: CondoFeaturesComponent;
  let fixture: ComponentFixture<CondoFeaturesComponent>;
  let mockCondo: CondoDTO;
  let mockBuilding: BuildingDTO;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CondoFeaturesComponent],
      imports: [MatIconModule] 
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
      Description: 'Spacious condo with great amenities'
    };

    mockBuilding = {
      Year: 1999,
      Name: 'Example Building',
      Address: '123 Main St'
    };
    component.condo = mockCondo;
    component.building = mockBuilding;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
