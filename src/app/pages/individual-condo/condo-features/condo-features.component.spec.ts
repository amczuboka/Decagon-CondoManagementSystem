import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CondoFeaturesComponent } from './condo-features.component';

describe('CondoFeaturesComponent', () => {
  let component: CondoFeaturesComponent;
  let fixture: ComponentFixture<CondoFeaturesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CondoFeaturesComponent]
    });
    fixture = TestBed.createComponent(CondoFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
