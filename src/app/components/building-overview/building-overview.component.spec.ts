import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingOverviewComponent } from './building-overview.component';

describe('BuildingOverviewComponent', () => {
  let component: BuildingOverviewComponent;
  let fixture: ComponentFixture<BuildingOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BuildingOverviewComponent]
    });
    fixture = TestBed.createComponent(BuildingOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
