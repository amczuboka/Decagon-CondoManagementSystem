import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KeyRegistrationComponent } from './key-registration.component';
import { AppModule } from 'src/app/app.module';
import { BuildingService } from 'src/app/services/building.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { BehaviorSubject, of } from 'rxjs';
import { User } from 'src/app/models/users';
import { Building, Condo, CondoStatus } from 'src/app/models/properties';
import { CondoType } from 'src/app/models/properties';

describe('KeyRegistrationComponent', () => {
  let component: KeyRegistrationComponent;
  let fixture: ComponentFixture<KeyRegistrationComponent>;
  let buildingService: BuildingService;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [KeyRegistrationComponent],
      providers: [BuildingService, AuthService, UserService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyRegistrationComponent);
    component = fixture.componentInstance;
    buildingService = TestBed.inject(BuildingService);
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('handleButtonClick', () => {
    it('should alert if input value is empty', async () => {
      spyOn(window, 'alert');
      component.inputElement.nativeElement.value = '';
      await component.handleButtonClick();
      expect(window.alert).toHaveBeenCalledWith('Input value is empty!');
    });

    it('should update condo occupant ID if condo found', async () => {
      const user: User = { uid: 'testUserId', email: 'test@example.com', photoURL: '', emailVerified: true };
      spyOn(authService, 'getUser').and.returnValue(Promise.resolve(user));

      const buildingsWithCondos: Building[] = [
        {
          ID: 'buildingId',
          Year: 2022,
          CompanyID: 'companyId',
          Name: 'Test Building',
          Address: 'Test Address',
          Bookings: [],
          Description: 'Test Description',
          Parkings: [],
          Lockers: [],
          Condos: [{ ID: 'condoId', Type: CondoType.Sale, OccupantID: '', UnitNumber: '', Fee: 0, Picture: '', Description: '', NumberOfBedrooms: 0, NumberOfBathrooms: 0, Status: CondoStatus.Vacant, SquareFootage: 0 }],
          Picture: '',
          Facilities: []
        }
      ];
      spyOn(buildingService, 'getAllBuildingsWithCondos').and.returnValue(Promise.resolve(buildingsWithCondos));
      spyOn(buildingService, 'updateCondo').and.returnValue(Promise.resolve());

      component.inputElement.nativeElement.value = 'condoId';
      await component.handleButtonClick();

      expect(buildingService.updateCondo).toHaveBeenCalledWith('buildingId', 'condoId', 'testUserId');
    });

    it('should log error if user not logged in', async () => {
      spyOn(console, 'error');
      spyOn(authService, 'getUser').and.returnValue(Promise.resolve(null));

      component.inputElement.nativeElement.value = 'condoId';
      await component.handleButtonClick();

      expect(console.error).toHaveBeenCalledWith('No user is currently logged in');
    });

    it('should log error if error fetching buildings with condos', async () => {
      spyOn(console, 'error');
      spyOn(authService, 'getUser').and.returnValue(Promise.resolve({ uid: 'testUserId' }));
      spyOn(buildingService, 'getAllBuildingsWithCondos').and.throwError('Test error');

      component.inputElement.nativeElement.value = 'condoId';
      await component.handleButtonClick();

      expect(console.error).toHaveBeenCalledWith('Error fetching buildings with condos:', jasmine.any(Error));
    });
  });

  describe('getAllBuildingsWithCondos', () => {
    it('should fetch buildings with condos successfully', async () => {
      const buildingsWithCondos: Building[] = [
        {
          ID: 'buildingId',
          Year: 2022,
          CompanyID: 'companyId',
          Name: 'Test Building',
          Address: 'Test Address',
          Bookings: [],
          Description: 'Test Description',
          Parkings: [],
          Lockers: [],
          Condos: [],
          Picture: '',
          Facilities: []
        }
      ];
      spyOn(buildingService, 'getAllBuildingsWithCondos').and.returnValue(Promise.resolve(buildingsWithCondos));

      await component.getAllBuildings();

      // Check that the method returns the expected data
      expect(buildingService.getAllBuildingsWithCondos).toHaveBeenCalled();
    });

    it('should log error if error fetching buildings with condos', async () => {
      spyOn(console, 'error');
      spyOn(buildingService, 'getAllBuildingsWithCondos').and.throwError('Test error');

      await component.getAllBuildings();

      expect(console.error).toHaveBeenCalledWith('Error fetching buildings with condos:', jasmine.any(Error));
    });
  });
});

