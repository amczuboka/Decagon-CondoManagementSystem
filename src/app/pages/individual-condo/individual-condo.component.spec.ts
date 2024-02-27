import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualCondoComponent } from './individual-condo.component';

describe('IndividualCondoComponent', () => {
  let component: IndividualCondoComponent;
  let fixture: ComponentFixture<IndividualCondoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndividualCondoComponent]
    });
    fixture = TestBed.createComponent(IndividualCondoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
