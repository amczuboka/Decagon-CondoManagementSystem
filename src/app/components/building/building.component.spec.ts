import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingComponent } from './building.component';
import { AppModule } from 'src/app/app.module';
import { Facilities } from 'src/app/models/properties';

describe('BuildingComponent', () => {
  let component: BuildingComponent;
  let fixture: ComponentFixture<BuildingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [BuildingComponent]
    });
    fixture = TestBed.createComponent(BuildingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onSearchTextEntered', () => {
    it('should update searchText when search text is entered', () => {
      const searchValue = 'testSearchValue';

      component.onSearchTextEntered(searchValue);

      expect(component.searchText).toEqual(searchValue);
    });
  });

  describe('getFacilityIcon', () => {
    it('should return correct icon for each facility', () => {
      expect(component.getFacilityIcon(Facilities.Gym)).toEqual('fitness_center');
      expect(component.getFacilityIcon(Facilities.Pool)).toEqual('pool');
      expect(component.getFacilityIcon(Facilities.Spa)).toEqual('spa');
    });

    it('should return empty string for unknown facility', () => {
      const pool: Facilities = Facilities.Pool;

      const result = component.getFacilityIcon(pool);

      expect(result).toEqual('pool');
    });
  });
});