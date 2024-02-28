import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyEmployeesComponent } from './my-employees.component';

describe('MyEmployeesComponent', () => {
  let component: MyEmployeesComponent;
  let fixture: ComponentFixture<MyEmployeesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyEmployeesComponent]
    });
    fixture = TestBed.createComponent(MyEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
