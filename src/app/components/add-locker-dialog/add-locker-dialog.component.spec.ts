import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLockerDialogComponent } from './add-locker-dialog.component';

describe('AddLockerDialogComponent', () => {
  let component: AddLockerDialogComponent;
  let fixture: ComponentFixture<AddLockerDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddLockerDialogComponent]
    });
    fixture = TestBed.createComponent(AddLockerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
