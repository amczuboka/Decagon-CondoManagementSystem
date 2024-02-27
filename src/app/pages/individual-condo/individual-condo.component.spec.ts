import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IndividualCondoComponent } from './individual-condo.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('IndividualCondoComponent', () => {
  let component: IndividualCondoComponent;
  let fixture: ComponentFixture<IndividualCondoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndividualCondoComponent ],
      schemas: [NO_ERRORS_SCHEMA] // Use this if you have external templates or styles
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualCondoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a defined building property', () => {
    expect(component.building).toBeTruthy();
    expect(component.building.Name).toEqual('Majestic Condo');
  });

  it('should have a defined condo property', () => {
    expect(component.condo).toBeTruthy();
    expect(component.condo.UnitNumber).toEqual(' Unit 201');
  });

  it('should have a defined userInfo property', () => {
    expect(component.userInfo).toBeTruthy();
    expect(component.userInfo.FirstName).toEqual('Maria');
  });

  // Test one of the methods (not implemented yet)
  it('goBack method should be callable', () => {
    spyOn(console, 'log');
    component.goBack();
    expect(console.log).toHaveBeenCalledWith('Functionality not implemented yet.');
  });

 
});
