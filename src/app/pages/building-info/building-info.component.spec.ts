import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingInfoComponent } from './building-info.component';

describe('BuildingInfoComponent', () => {
  let component: BuildingInfoComponent;
  let fixture: ComponentFixture<BuildingInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BuildingInfoComponent]
    });
    fixture = TestBed.createComponent(BuildingInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
