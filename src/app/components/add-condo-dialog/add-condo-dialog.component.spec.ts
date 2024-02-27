import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCondoDialogComponent } from './add-condo-dialog.component';

describe('AddCondoDialogComponent', () => {
  let component: AddCondoDialogComponent;
  let fixture: ComponentFixture<AddCondoDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddCondoDialogComponent]
    });
    fixture = TestBed.createComponent(AddCondoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
