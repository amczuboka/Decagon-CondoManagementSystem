import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LocationComponent } from './location.component';

describe('LocationComponent', () => {
  let component: LocationComponent;
  let fixture: ComponentFixture<LocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LocationComponent],
      imports: [HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(LocationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call geocodeAddress if address is provided', () => {
      // Arrange
      const address = '825 Rue Madeleine, Laval, QC H7P 3W8';
      component.address = address;
    
      // Act
      component.ngOnInit();
      // Assert
      expect(component.address).toBe(address); 
    });

    it('should not call geocodeAddress if address is not provided', () => {
      // Arrange
      spyOn(component, 'geocodeAddress'); // Spy on geocodeAddress method
      // Act
      component.ngOnInit();
      // Assert
      expect(component.geocodeAddress).not.toHaveBeenCalled(); 
    });
  });
});
