import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesListComponent } from './employees-list.component';

describe('EmployeesListComponent', () => {
  let component: EmployeesListComponent;
  let fixture: ComponentFixture<EmployeesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeesListComponent]
    });
    fixture = TestBed.createComponent(EmployeesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
