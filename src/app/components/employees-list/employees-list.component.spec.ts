import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AppModule } from 'src/app/app.module';

import { EmployeesListComponent } from './employees-list.component';

describe('EmployeesListComponent', () => {
  let component: EmployeesListComponent;
  let fixture: ComponentFixture<EmployeesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, MatSnackBarModule],
      declarations: [EmployeesListComponent]
    });
    fixture = TestBed.createComponent(EmployeesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check all', () => {
    component.checkAll({ checked: true } as any);
    expect(component.employees.every(x => x.checked)).toBeTrue();
  });

  it('should uncheck all', () => {
    component.checkAll({ checked: false } as any);
    expect(component.employees.every(x => !x.checked)).toBeTrue();
  });

  it('should check if all checked', () => {
    component.employees = [{ checked: true }, { checked: true }];
    expect(component.isAllChecked()).toBeTrue();
  });

  it('should check if some items checked', () => {
    component.employees = [{ checked: true }, { checked: false }];
    expect(component.isSomeItemsChecked()).toBeTrue();
  });

  it('should remove selected items', () => {
    component.employees = [{ checked: true }, { checked: false }];
    component.remeveSelectedItems();
    expect(component.employees.length).toBe(1);
  });

  it('should update', () => {
    component.update();
    expect(component.employees).toEqual(component.employees);
  });

  it('should open snack bar', () => {
    spyOn(component, 'openSnackBar');
    component.openSnackBar('test');
    expect(component.openSnackBar).toHaveBeenCalled();
  });
});
