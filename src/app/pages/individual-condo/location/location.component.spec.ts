import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Component, Input } from '@angular/core';
import { LocationComponent } from './location.component';

// Mock Parent Component
@Component({
  selector: 'app-mock-individual-condo',
  template: `<app-location [address]="building.Address"></app-location>`,
})
class MockIndividualCondoComponent {
  @Input() building = {
    Address: '825 Rue Madeleine, Laval, QC H7P 3W8',
  };
}

describe('LocationComponent', () => {
  let component: LocationComponent;
  let fixture: ComponentFixture<MockIndividualCondoComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LocationComponent, MockIndividualCondoComponent],
      imports: [HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MockIndividualCondoComponent);
    component = fixture.debugElement.children[0].componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify(); // Ensure no outstanding HTTP calls
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call geocodeAddress if address is provided', () => {
    spyOn(component, 'geocodeAddress');
    component.ngOnInit();
    expect(component.geocodeAddress).toHaveBeenCalled();
  });

  it('should make HTTP request to geocoding API', () => {
    const expectedUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      component.address
    )}.json?access_token=pk.eyJ1IjoiY2FybGFzaGF3aSIsImEiOiJjbHN5dzBzMXAwaG1kMmtyb3pocnBvZzBlIn0.4k81B20yAJlUaU3hWCiCpQ`;
    component.geocodeAddress();
    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('GET');
    req.flush({}); // Mock response
  });
});
