import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AddNewBuildingOperationComponent } from './add-new-building-operation.component';
import { By } from '@angular/platform-browser';

describe('AddNewBuildingOperationComponent', () => {
  let component: AddNewBuildingOperationComponent;
  let fixture: ComponentFixture<AddNewBuildingOperationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewBuildingOperationComponent]
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
    const buildingSelect = fixture.debugElement.query(By.css('select'));

    expect(operationNameInput).toBeTruthy();
    expect(descriptionInput).toBeTruthy();
    expect(costInput).toBeTruthy();
    expect(buildingSelect).toBeTruthy();
  });

  it('should render two building options in the select element', () => {
    const buildingOptions = fixture.debugElement.queryAll(By.css('select option'));
    expect(buildingOptions.length).toBe(2);
    expect(buildingOptions[0].nativeElement.textContent).toContain('Building A');
    expect(buildingOptions[1].nativeElement.textContent).toContain('Building B');
  });

  it('should have a submit button', () => {
    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(submitButton).toBeTruthy();
  });
});
