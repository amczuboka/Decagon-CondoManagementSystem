import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingComponent } from './building.component';
import { AppModule } from 'src/app/app.module';
import { Building, Facilities } from 'src/app/models/properties';
import { Router } from '@angular/router';

describe('BuildingComponent', () => {
  let component: BuildingComponent;
  let fixture: ComponentFixture<BuildingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [BuildingComponent],
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
      expect(component.getFacilityIcon(Facilities.Gym)).toEqual(
        'fitness_center'
      );
      expect(component.getFacilityIcon(Facilities.Pool)).toEqual('pool');
      expect(component.getFacilityIcon(Facilities.Spa)).toEqual('spa');
    });

    it('should return empty string for unknown facility', () => {
      const pool: Facilities = Facilities.Pool;

      const result = component.getFacilityIcon(pool);

      expect(result).toEqual('pool');
    });
  });

    describe('Naviguation', () => {
      let router: Router;

      beforeEach(() => {
        router = TestBed.inject(Router);
      });

      it('should navigate to building-info page with the selected building as a query parameter', () => {
        const item: Building = {
          ID: '1', Name: 'Building 1',
          Year: 0,
          CompanyID: '',
          Address: '',
          Bookings: [],
          Description: '',
          Parkings: [],
          Lockers: [],
          Condos: [],
          Picture: '',
          Facilities: []
        };
        const queryParams = { building: JSON.stringify(item) };
        const navigateSpy = spyOn(router, 'navigate');

        component.navigateToBuildingInfo(item);

        expect(navigateSpy).toHaveBeenCalledWith(['/building-info'], { queryParams });
      });
    });
  });
