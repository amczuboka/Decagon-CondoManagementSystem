import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewPropertyComponent } from './add-new-property.component';

describe('AddNewPropertyComponent', () => {
  let component: AddNewPropertyComponent;
  let fixture: ComponentFixture<AddNewPropertyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewPropertyComponent]
    });
    fixture = TestBed.createComponent(AddNewPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
