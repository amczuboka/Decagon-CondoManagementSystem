import { ComponentFixture, TestBed, fakeAsync, flushMicrotasks, tick } from '@angular/core/testing';
import { PaymentComponent, phoneNumberValidator, isValidEmail, maxFeeValidator } from './payment.component';
import { FormControl } from '@angular/forms';
import { BuildingService } from 'src/app/services/building.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AppModule } from 'src/app/app.module';
import { AuthService } from 'src/app/services/auth.service';
import { Condo, CondoStatus, CondoType, ParkingLockerStatus, ParkingSpot, ParkingType } from 'src/app/models/properties';
import { BehaviorSubject, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('PaymentComponent', () => {
  let component: PaymentComponent;
  let fixture: ComponentFixture<PaymentComponent>;
  let authService: AuthService;
  let buildingService: BuildingService;
  let mockBuildingService: jasmine.SpyObj<BuildingService>;
  let mockAuthService: any;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['getUser']);

    await TestBed.configureTestingModule({
      declarations: [ PaymentComponent ],
      imports: [
        AppModule,
        MatFormFieldModule
      ],
      providers: [
        BuildingService,
        AuthService,
        { provide: ActivatedRoute, useValue:  { 
          queryParams: of({
            condo: JSON.stringify({
          ID: '1',
          Type: CondoType.Sale,
          OccupantID: '',
          UnitNumber: '1',
          Fee: 1000,
          Picture: '',
          Description: 'test',
          NumberOfBedrooms: 2,
          NumberOfBathrooms: 2,
          Status: CondoStatus.Vacant,
          SquareFootage: 1000,
        }), 
        buildingID: 'someBuildingId',
      })
      }},
      { provide: AuthService, useValue: mockAuthService },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    buildingService = TestBed.inject(BuildingService);
    mockBuildingService = jasmine.createSpyObj('BuildingService', [
      'getBuilding',
      'subscribeToCondoById', 
    ]);    
    mockBuildingService.condoSubject = new BehaviorSubject<Condo | null>(null);
    mockBuildingService.condo$ = mockBuildingService.condoSubject.asObservable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should call getUserParkings on init', fakeAsync(() => {
    const parkings: ParkingSpot[] = [
      {
        ID: "1",
        OccupantID: "testUserID",
        Number: "1",
        Status: ParkingLockerStatus.Unavailable,
        ParkingType: ParkingType.Standard,
        Fee: 1     
      },
      {
        ID: "2",
        OccupantID: "testUserID",
        Number: "2",
        Status: ParkingLockerStatus.Unavailable,
        ParkingType: ParkingType.Standard,
        Fee: 2  
      }
    ];

    mockAuthService.getUser.and.returnValue(Promise.resolve({ uid: 'testUserID' }));
    spyOn(buildingService, 'getUserParkings').and.returnValue(Promise.resolve(parkings));

  component.ngOnInit();
  tick();

  expect(buildingService.getUserParkings).toHaveBeenCalledWith(component.buildingID, component.myUser.uid);
  }));
  
  it('should call updateCondoFee when submitPayment is called and form is valid', async () => {
    component.paymentForm = { valid: true, markAllAsTouched: () => {} } as any;
    spyOn(buildingService, 'updateCondoFee').and.returnValue(Promise.resolve());
  
    const mockCondo: Condo = {
      ID: '1',
      Type: CondoType.Sale,
      OccupantID: '',
      UnitNumber: '1',
      Fee: 1000,
      Picture: '',
      Description: 'test',
      NumberOfBedrooms: 2,
      NumberOfBathrooms: 2,
      Status: CondoStatus.Vacant,
      SquareFootage: 1000,
    };

    component.buildingID = 'someBuildingId';
    component.condo = mockCondo;
    component.balance = 100;
  
    await component.submitPayment();
  
    expect(buildingService.updateCondoFee).toHaveBeenCalled();
  });

  describe('phoneNumberValidator', () => {
    it('should return null for valid phone numbers', () => {
      const control = new FormControl('123-456-7890');
      expect(phoneNumberValidator()(control)).toBeNull();
    });
  
    it('should return an error for invalid phone numbers', () => {
      const control = new FormControl('123-456');
      expect(phoneNumberValidator()(control)).toEqual({ invalidPhoneNumber: true });
    });
  });
  
  describe('isValidEmail', () => {
    it('should return null for valid emails', () => {
      const control = new FormControl('test@example.com');
      expect(isValidEmail()(control)).toBeNull();
    });
  
    it('should return an error for invalid emails', () => {
      const control = new FormControl('test@example');
      expect(isValidEmail()(control)).toEqual({ invalidEmail: true });
    });
  });
  
  describe('maxFeeValidator', () => {
    it('should return null if value is less than or equal to max fee', () => {
      const control = new FormControl(50);
      expect(maxFeeValidator(() => 100)(control)).toBeNull();
    });
  
    it('should return an error if value is greater than max fee', () => {
      const control = new FormControl(150);
      expect(maxFeeValidator(() => 100)(control)).toEqual({ maxFee: true });
    });
  });

  it('should initialize parkingFee to userParkings.length * 2 if userParkings is not empty', fakeAsync(() => {
    const mockUser = { uid: 'someUserId' };
    const mockParkings: ParkingSpot[] = [
      {
        ID: "1",
        OccupantID: "testUserID",
        Number: "1",
        Status: ParkingLockerStatus.Unavailable,
        ParkingType: ParkingType.Standard,
        Fee: 1     
      },
      {
        ID: "2",
        OccupantID: "testUserID",
        Number: "2",
        Status: ParkingLockerStatus.Unavailable,
        ParkingType: ParkingType.Standard,
        Fee: 2  
      }
    ];
  
    mockAuthService.getUser.and.returnValue(Promise.resolve(mockUser));
    spyOn(buildingService, 'getUserParkings').and.returnValue(Promise.resolve(mockParkings));
  
    component.ngOnInit();
    flushMicrotasks();
  
    expect(component.parkingFee).toEqual(mockParkings.length * 2);
  }));

  it('should initialize parkingFee to 0 if userParkings is empty', fakeAsync(() => {
    const mockUser = { uid: 'someUserId' };
    const mockParkings: ParkingSpot[] = [];
  
    mockAuthService.getUser.and.returnValue(Promise.resolve(mockUser));
    spyOn(buildingService, 'getUserParkings').and.returnValue(Promise.resolve(mockParkings));
  
    component.ngOnInit();
    flushMicrotasks();
  
    expect(component.parkingFee).toEqual(0);
  }));
});