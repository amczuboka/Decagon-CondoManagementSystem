import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BudgetReportComponent } from './budget-report.component';

describe('BudgetReportComponent', () => {
  let component: BudgetReportComponent;
  let fixture: ComponentFixture<BudgetReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BudgetReportComponent],
      imports: [MatTableModule, BrowserAnimationsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render table with correct data', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.title').textContent).toContain('Budget Report');
    expect(compiled.querySelectorAll('table tbody tr').length).toEqual(10); 
  });

  it('should calculate total condo fee revenue correctly', () => {
    const totalCondoFeeRevenue = component.totalCondoFeeRevenue;
    const expectedTotalCondoFeeRevenue = component.fakeBudget.reduce((acc, item) => acc + item.CondoFeeRevenue, 0);
    expect(totalCondoFeeRevenue).toBeGreaterThan(0); 
    expect(totalCondoFeeRevenue).toEqual(expectedTotalCondoFeeRevenue);
  });

  it('should calculate total operation costs correctly', () => {
    const totalOperationCosts = component.totalOperationCosts;
    const expectedTotalOperationCosts = component.fakeBudget.reduce((acc, item) => acc + item.OperationCosts, 0);
    expect(totalOperationCosts).toBeGreaterThan(0);
    expect(totalOperationCosts).toEqual(expectedTotalOperationCosts); 
  });

  it('should calculate total profit correctly', () => {
    const totalProfit = component.totalProfit;
    const expectedTotalProfit = component.fakeBudget.reduce((acc, item) => acc + (item.Profit ?? 0), 0);
    expect(totalProfit).toBeGreaterThan(0);
    expect(totalProfit).toEqual(expectedTotalProfit); 
  });
  
});
