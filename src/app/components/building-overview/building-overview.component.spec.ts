import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingOverviewComponent } from './building-overview.component';
import { MatDividerModule } from '@angular/material/divider';
import { AppModule } from 'src/app/app.module';

describe('BuildingOverviewComponent', () => {
  let component: BuildingOverviewComponent;
  let fixture: ComponentFixture<BuildingOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatDividerModule, AppModule],
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
