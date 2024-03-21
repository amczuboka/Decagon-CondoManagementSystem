import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AddNewBuildingOperationComponent } from './add-new-building-operation.component';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import { MatSelectModule } from '@angular/material/select'; // Import MatSelectModule

describe('AddNewBuildingOperationComponent', () => {
  let component: AddNewBuildingOperationComponent;
  let fixture: ComponentFixture<AddNewBuildingOperationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewBuildingOperationComponent],
      imports: [ReactiveFormsModule, MatSelectModule] // Add ReactiveFormsModule and MatSelectModule to imports
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewBuildingOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render input fields for operation name, description, cost, and building', () => {
    const operationNameInput = fixture.debugElement.query(By.css('input[placeholder="Operation Name"]'));
    const descriptionInput = fixture.debugElement.query(By.css('input[placeholder="Description"]'));
    const costInput = fixture.debugElement.query(By.css('input[placeholder="Cost"]'));
    const buildingSelect = fixture.debugElement.query(By.css('mat-select')); // Change 'select' to 'mat-select'

    expect(operationNameInput).toBeTruthy();
    expect(descriptionInput).toBeTruthy();
    expect(costInput).toBeTruthy();
    expect(buildingSelect).toBeTruthy();
  });
  
  
  it('should have a submit button', () => {
    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(submitButton).toBeTruthy();
  });
});
