import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { KeyRegistrationComponent } from './key-registration.component';
import { AppModule } from 'src/app/app.module';
import { BuildingService } from 'src/app/services/building.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { BehaviorSubject, of } from 'rxjs';
import { User } from 'src/app/models/users';
import { Building, Condo, CondoStatus } from 'src/app/models/properties';
import { CondoType } from 'src/app/models/properties';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ElementRef } from '@angular/core';

describe('KeyRegistrationComponent', () => {
  let component: KeyRegistrationComponent;
  let fixture: ComponentFixture<KeyRegistrationComponent>;
  let buildingService: BuildingService;
  let authService: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule, MatSelectModule, MatFormFieldModule, MatInputModule, MatButtonModule],
      declarations: [KeyRegistrationComponent],
      providers: [
        BuildingService,
        AuthService,
        UserService,
        { provide: ElementRef, useValue: { nativeElement: { value: 'testKey' } } } // Mocking ElementRef
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyRegistrationComponent);
    component = fixture.componentInstance;
    buildingService = TestBed.inject(BuildingService);
    authService = TestBed.inject(AuthService);
    userService = TestBed.inject(UserService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should handle empty input', async () => {
    spyOn(window, 'alert');
    component.inputElement.nativeElement.value = ''; // Set input value to empty string
    await component.handleButtonClick();
    expect(window.alert).toHaveBeenCalledWith('Input value is empty!');
  });

  it('should log error if user not logged in', async () => {
    spyOn(console, 'error');
    spyOn(authService, 'getUser').and.returnValue(Promise.resolve(null));

    component.inputElement.nativeElement.value = 'condoId';
    await component.handleButtonClick();

    expect(console.error).toHaveBeenCalledWith('No user is currently logged in');
  });


  it('should register condo successfully', async () => {
    const fakeUser = { uid: 'testUserID' } as User; // Mock user
    spyOn(authService, 'getUser').and.returnValue(Promise.resolve(fakeUser));
    spyOn(component, 'registerForItem').and.callThrough(); // Use callThrough to let the method execute
  
    component.registrationType = 'condo'; // Set registration type to condo
    component.inputElement.nativeElement.value = 'testKey'; // Set existing item
  
    await component.handleButtonClick();
  
    expect(authService.getUser).toHaveBeenCalled();
    expect(component.registerForItem).toHaveBeenCalledWith('testKey', 'testUserID', 'Condos');
  });
  
  it('should handle item not found', async () => {
    const fakeUser = { uid: 'testUserID' } as User; // Mock user
    spyOn(authService, 'getUser').and.returnValue(Promise.resolve(fakeUser));
    spyOn(component, 'registerForItem').and.callThrough(); // Use callThrough to let the method execute
  
    // Mock buildings without the item
    const buildings: Building[] = [
      { 
        ID: 'building1', 
        Year: 2022, 
        CompanyID: 'company1',
        Name: 'Building 1', 
        Address: 'Address 1',
        Bookings: [], 
        Description: 'Description 1',
        Parkings: [], 
        Lockers: [], 
        Condos: [], 
        Picture: 'picture1',
        Facilities: []
      },
      { 
        ID: 'building2', 
        Year: 2023, 
        CompanyID: 'company2',
        Name: 'Building 2', 
        Address: 'Address 2',
        Bookings: [], 
        Description: 'Description 2',
        Parkings: [], 
        Lockers: [], 
        Condos: [], 
        Picture: 'picture2',
        Facilities: []
      }
    ];
  
    spyOn(buildingService, 'getAllBuildingsWithItems').and.returnValue(Promise.resolve(buildings));
  
    component.registrationType = 'condo'; // Set registration type to condo
    component.inputElement.nativeElement.value = 'nonExistingItem'; // Set non-existing item
    spyOn(window, 'alert');
    await component.handleButtonClick();
    expect(component.registerForItem).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Condo not found!');
  });

  });

