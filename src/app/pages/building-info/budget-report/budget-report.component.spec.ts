import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BudgetReportComponent } from './budget-report.component';
import { Building, CondoStatus, CondoType, Operation } from 'src/app/models/properties';

describe('BudgetReportComponent', () => {
  let component: BudgetReportComponent;
  let fixture: ComponentFixture<BudgetReportComponent>;

  // Mock buildings data
  const mockBuilding1: Building = {
    ID: '1',
    Year: 2022,
    CompanyID: 'company1',
    Name: 'Building 1',
    Address: '123 Main St',
    Bookings: [],
    Description: 'Description of Building 1',
    Parkings: [],
    Lockers: [],
    Condos: [
      {
        ID: '101',
        Type: CondoType.Sale,
        OccupantID: 'occupant1',
        UnitNumber: '101A',
        Fee: 1000,
        Picture: 'condo_picture_101A.jpg',
        Description: 'Description of Condo 101A',
        NumberOfBedrooms: 2,
        NumberOfBathrooms: 2,
        Status: CondoStatus.Owned,
        SquareFootage: 1000,
      },
    ],
    Picture: 'building_picture_1.jpg',
    Facilities: [],
    Operations: [
      {
        name: 'Operation 1',
        description: 'Description of Operation 1',
        cost: 500,
      },
    ],
  };

  const mockBuilding2: Building = {
    ID: '2',
    Year: 2022,
    CompanyID: 'company1',
    Name: 'Building 2',
    Address: '456 Elm St',
    Bookings: [],
    Description: 'Description of Building 2',
    Parkings: [],
    Lockers: [],
    Condos: [
      {
        ID: '201',
        Type: CondoType.Sale,
        OccupantID: 'occupant2',
        UnitNumber: '201B',
        Fee: 1200,
        Picture: 'condo_picture_201B.jpg',
        Description: 'Description of Condo 201B',
        NumberOfBedrooms: 3,
        NumberOfBathrooms: 2,
        Status: CondoStatus.Rented,
        SquareFootage: 1200,
      },
    ],
    Picture: 'building_picture_2.jpg',
    Facilities: [],
    Operations: [
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BudgetReportComponent],
      imports: [MatTableModule, BrowserAnimationsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetReportComponent);
    component = fixture.componentInstance;
    // Provide mock buildings data
    component.buildings = [mockBuilding1, mockBuilding2];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render table with correct data', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.title').textContent).toContain('Budget Report');
    expect(compiled.querySelectorAll('table tbody tr').length).toEqual(2); // 2 buildings in mock data
  });

  it('should calculate total condo fee revenue correctly', () => {
    const totalCondoFeeRevenue = component.totalCondoFeeRevenue;
    const expectedTotalCondoFeeRevenue = mockBuilding1.Condos.reduce((acc, condo) => acc + condo.Fee, 0)
      + mockBuilding2.Condos.reduce((acc, condo) => acc + condo.Fee, 0);
    expect(totalCondoFeeRevenue).toEqual(expectedTotalCondoFeeRevenue);
  });

  it('should calculate total operation costs correctly', () => {
    const totalOperationCosts = component.totalOperationCosts;
    const expectedTotalOperationCosts = mockBuilding1.Operations.reduce((acc, operation) => acc + operation.cost, 0);
    expect(totalOperationCosts).toEqual(expectedTotalOperationCosts);
  });

  it('should calculate total profit correctly', () => {
    const totalProfit = component.totalProfit;
    const condoFeeRevenue = component.totalCondoFeeRevenue;
    const operationCosts = component.totalOperationCosts;
    const expectedTotalProfit = condoFeeRevenue - operationCosts;
    expect(totalProfit).toEqual(expectedTotalProfit);
  });
});
