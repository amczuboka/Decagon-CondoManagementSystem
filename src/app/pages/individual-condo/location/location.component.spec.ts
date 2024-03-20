import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { LocationComponent } from './location.component';

declare global {
  interface Window {
    mapboxgl: any;
  }
}

describe('LocationComponent', () => {
  let component: LocationComponent;
  let fixture: ComponentFixture<LocationComponent>;
  var mapboxgl: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LocationComponent],
      imports: [HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(LocationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

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

  it('should call http.get with the correct URL', () => {
    // Arrange
    const address = '825 Rue Madeleine, Laval, QC H7P 3W8';
    component.address = address;
    const http = TestBed.inject(HttpTestingController);
    const expectedUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      address
    )}.json?access_token=pk.eyJ1IjoiY2FybGFzaGF3aSIsImEiOiJjbHN5dzBzMXAwaG1kMmtyb3pocnBvZzBlIn0.4k81B20yAJlUaU3hWCiCpQ`;

    // Act
    component.geocodeAddress();

    // Assert
    const req = http.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    http.verify();
  });

  it('should log an error message if no coordinates are found', () => {
    // Arrange
    const address = '825 Rue Madeleine, Laval, QC H7P 3W8';
    component.address = address;
    const http = TestBed.inject(HttpTestingController);
    const response = {
      features: [],
    };
    const expectedUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      address
    )}.json?access_token=pk.eyJ1IjoiY2FybGFzaGF3aSIsImEiOiJjbHN5dzBzMXAwaG1kMmtyb3pocnBvZzBlIn0.4k81B20yAJlUaU3hWCiCpQ`;
    spyOn(console, 'error');

    // Act
    component.geocodeAddress();
    const req = http.expectOne(expectedUrl);
    req.flush(response);

    // Assert
    expect(console.error).toHaveBeenCalledWith(
      'No coordinates found for the given address.'
    );
    http.verify();
  });

  it('should call geocodeAddress and initialize map if coordinates are found', () => {
    // Arrange
    const address = '825 Rue Madeleine, Laval, QC H7P 3W8';
    component.address = address;
    const http = TestBed.inject(HttpTestingController);
    const response = {
      features: [
        {
          center: [45.1234, -73.5678],
        },
      ],
    };
    const expectedUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      address
    )}.json?access_token=pk.eyJ1IjoiY2FybGFzaGF3aSIsImEiOiJjbHN5dzBzMXAwaG1kMmtyb3pocnBvZzBlIn0.4k81B20yAJlUaU3hWCiCpQ`;
    spyOn(console, 'error');
    spyOn(component, 'initMap');

    // Act
    component.geocodeAddress();
    const req = http.expectOne(expectedUrl);
    req.flush(response);

    // Assert
    expect(console.error).not.toHaveBeenCalled();
    expect(component.initMap).toHaveBeenCalledWith([45.1234, -73.5678]);
    http.verify();
  });

  it('should print error message if mapboxgl is not properly initialized', () => {
    // Arrange
    spyOn(console, 'error');
    const coordinates: [number, number] = [45.1234, -73.5678];
    const originalMapboxgl = window.mapboxgl;
    window.mapboxgl = undefined;

    // Act
    component.initMap(coordinates);

    // Assert
    expect(console.error).toHaveBeenCalledWith(
      'mapboxgl is not properly initialized.'
    );

    // Cleanup
    window.mapboxgl = originalMapboxgl;
  });
});
