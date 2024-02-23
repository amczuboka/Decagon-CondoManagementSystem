import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingOverviewComponent } from './building-overview.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule} from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AppModule } from 'src/app/app.module';

describe('BuildingOverviewComponent', () => {
  let component: BuildingOverviewComponent;
  let fixture: ComponentFixture<BuildingOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatDividerModule, MatRadioModule, MatCardModule, MatIconModule,AppModule],
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
