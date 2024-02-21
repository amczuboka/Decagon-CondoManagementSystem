import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingInfoComponent } from './building-info.component';
import { MatTabsModule } from '@angular/material/tabs';
import { AppModule } from 'src/app/app.module';

describe('BuildingInfoComponent', () => {
  let component: BuildingInfoComponent;
  let fixture: ComponentFixture<BuildingInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ MatTabsModule, AppModule ],
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
