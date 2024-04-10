import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { AddNewPropertyComponent } from './add-new-property.component';
import { AppModule } from 'src/app/app.module';
import { BuildingService } from 'src/app/services/building.service';
import {
  CondoStatus,
  CondoType,
  Facilities,
  ParkingLockerStatus,
  ParkingType,
} from 'src/app/models/properties';
import { StorageService } from 'src/app/services/storage.service';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from 'src/app/services/notification.service';

describe('AddNewPropertyComponent', () => {
  let component: AddNewPropertyComponent;
  let afterClosedSubject: Subject<any>;
  let fixture: ComponentFixture<AddNewPropertyComponent>;
  let dialog: MatDialog;
  let buildingService: BuildingService;
  let storageService: StorageService;
  let condoImage: File;
  let notificationService: NotificationService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [AddNewPropertyComponent],
      imports: [AppModule, ReactiveFormsModule],
      providers: [{ provide: MatDialog }, { provide: NotificationService }],
    });
    fixture = TestBed.createComponent(AddNewPropertyComponent);
    dialog = TestBed.inject(MatDialog);
    buildingService = TestBed.inject(BuildingService);
    storageService = TestBed.inject(StorageService);

    afterClosedSubject = new Subject<any>();
    notificationService = TestBed.inject(NotificationService);
    component = fixture.componentInstance;
    fixture.detectChanges();

    condoImage = new File(['file content'], 'test2.txt', {
      type: 'text/plain',
    });
  });

  afterEach(async () => {
    component.Propertyform.reset(); // Reset the form
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize Propertyform with the correct form controls', () => {
    component.ngOnInit();
    expect(component.Propertyform.get('Year')).toBeDefined();
    expect(component.Propertyform.get('Name')).toBeDefined();
    expect(component.Propertyform.get('Country')).toBeDefined();
    expect(component.Propertyform.get('State')).toBeDefined();
    expect(component.Propertyform.get('City')).toBeDefined();
    expect(component.Propertyform.get('StreetNN')).toBeDefined();
    expect(component.Propertyform.get('ZipCode')).toBeDefined();
    expect(component.Propertyform.get('Description')).toBeDefined();
    expect(component.Propertyform.get('Picture')).toBeDefined();
    expect(component.Propertyform.get('Facilities')).toBeDefined();
  });

  it('should set the required validator for Year control', () => {
    component.ngOnInit();
    const yearControl = component.Propertyform.get('Year');
    expect(yearControl?.validator).toBe(Validators.required);
  });

  it('should set the required validator for Name control', () => {
    component.ngOnInit();
    const nameControl = component.Propertyform.get('Name');
    expect(nameControl?.validator).toBe(Validators.required);
  });

  it('should set the required validator for Country control', () => {
    component.ngOnInit();
    const contryControl = component.Propertyform.get('Country');
    expect(contryControl?.validator).toBe(Validators.required);
  });

  it('should set the required validator for State control', () => {
    component.ngOnInit();
    const stateControl = component.Propertyform.get('State');
    expect(stateControl?.validator).toBe(Validators.required);
  });

  it('should set the required validator for City control', () => {
    component.ngOnInit();
    const cityControl = component.Propertyform.get('City');
    expect(cityControl?.validator).toBe(Validators.required);
  });

  it('should set the required validator for StreetNN control', () => {
    component.ngOnInit();
    const streetNNControl = component.Propertyform.get('StreetNN');
    expect(streetNNControl?.validator).toBe(Validators.required);
  });

  it('should set the required validator for ZipCode control', () => {
    component.ngOnInit();
    const zipCodeControl = component.Propertyform.get('ZipCode');
    expect(zipCodeControl?.validator).toBe(Validators.required);
  });

  it('should set the required validator for Description control', () => {
    component.ngOnInit();
    const descriptionControl = component.Propertyform.get('Description');
    expect(descriptionControl?.validator).toBe(Validators.required);
  });

  it('should set the required validator for Picture control', () => {
    component.ngOnInit();
    const pictureControl = component.Propertyform.get('Picture');
    expect(pictureControl?.validator).toBe(Validators.required);
  });

  it('should initialize Facilities control with the correct form array', () => {
    component.ngOnInit();
    expect(component.Propertyform.get('Facilities')).toEqual(
      component.facilities
    );
  });

  it('should open AddLockerDialogComponent and handle newly added item', fakeAsync(() => {
    const dialogSpy = spyOn(dialog, 'open').and.returnValue({
      afterClosed: () => afterClosedSubject.asObservable(),
    } as any);

    const addLocker = spyOn(component.LockerItems, 'push').and.returnValue(
      component.LockerItems.push({
        Height: '60cm',
        Width: '30cm',
        Length: '45cm',
        Number: 'L101',
        Fee: 324,
        Quantity: 23,
      })
    );

    component.openAddLockerDialog();

    afterClosedSubject.complete();
    tick(20000);
    expect(dialogSpy).toHaveBeenCalled();
    expect(addLocker).toHaveBeenCalled();
  }));

  it('should open AddCondoDialogComponent and handle newly added item', fakeAsync(() => {
    const dialogSpy = spyOn(dialog, 'open').and.returnValue({
      afterClosed: () => afterClosedSubject.asObservable(),
    } as any);

    const addLocker = spyOn(component.CondoItems, 'push').and.returnValue(
      component.CondoItems.push({
        SquareFootage: 2143,
        NumberOfBedrooms: 2,
        NumberOfBathrooms: 3,
        Type: 'Rent',
        Fee: 2345,
        Quantity: 32,
        Picture: 'nop3',
        PictureScr: 'nop3',
        Description: 'beautiful villa',
        UnitNumber: 'V101',
      })
    );

    component.openAddCondoDialog();

    afterClosedSubject.complete();
    tick(20000);
    expect(dialogSpy).toHaveBeenCalled();
    expect(addLocker).toHaveBeenCalled();
  }));

  it('should open AddParkingDialogComponent and handle newly added item', fakeAsync(() => {
    const dialogSpy = spyOn(dialog, 'open').and.returnValue({
      afterClosed: () => afterClosedSubject.asObservable(),
    } as any);

    const addLocker = spyOn(component.ParkingItems, 'push').and.returnValue(
      component.ParkingItems.push({
        Number: 'P101',
        ParkingType: 'Standard',
        Fee: 132,
        Quantity: 3245,
      })
    );

    component.openAddCondoDialog();

    afterClosedSubject.complete();
    tick(20000);
    expect(dialogSpy).toHaveBeenCalled();
    expect(addLocker).toHaveBeenCalled();
  }));

  it('should delete condo items', () => {
    // Condo Objects
    let condoObjects = [
      {
        SquareFootage: 2143,
        NumberOfBedrooms: 2,
        NumberOfBathrooms: 3,
        Type: 'Rent',
        Fee: 2345,
        Quantity: 32,
        Picture: 'nop3',
        PictureSrc: 'nop3',
        Description: 'beautiful villa',
        UnitNumber: 'V101',
      },
      {
        SquareFootage: 1800,
        NumberOfBedrooms: 3,
        NumberOfBathrooms: 2,
        Type: 'Sale',
        Fee: 3000,
        Quantity: 20,
        Picture: 'villa_image',
        PictureSrc: 'villa_image',
        Description: 'luxury villa with a view',
        UnitNumber: 'V202',
      },
    ];
    const item = condoObjects[0]; // Replace {} with the actual item to be deleted
    component.CondoItems = condoObjects; // Set the initial value of CondoItems array
    component.deleteCondoItems(item);
    expect(component.CondoItems.length).toBe(1);
    expect(component.CondoItems).toEqual([condoObjects[0]]);
  });

  it('should delete locker items', () => {
    // Locker Objects
    let lockerObjects = [
      {
        Height: '60cm',
        Width: '30cm',
        Length: '45cm',
        Number: 'L101',
        Fee: 324,
        Quantity: 23,
      },
      {
        Height: '80cm',
        Width: '40cm',
        Length: '60cm',
        Number: 'L202',
        Fee: 456,
        Quantity: 15,
      },
    ];
    const item = lockerObjects[0];
    component.LockerItems = lockerObjects;
    component.deleteLockerItems(item);
    expect(component.LockerItems.length).toBe(1);
    expect(component.LockerItems).toEqual([lockerObjects[0]]);
  });

  it('should delete parking spot items', () => {
    // Parking Spot Objects
    let parkingSpotObjects = [
      {
        Number: 'P101',
        ParkingType: 'Standard',
        Fee: 132,
        Quantity: 3245,
      },
      {
        Number: 'P202',
        ParkingType: 'Handicap',
        Fee: 200,
        Quantity: 500,
      },
    ];
    const item = parkingSpotObjects[0];
    component.ParkingItems = parkingSpotObjects;
    component.deleteParkingItems(item);
    expect(component.ParkingItems.length).toBe(1);
    expect(component.ParkingItems).toEqual([parkingSpotObjects[0]]);
  });

  it('should mark all form controls as touched and show alert if form is invalid', () => {
    spyOn(notificationService, 'sendAlert').and.returnValue(Promise.resolve());
    component.Propertyform.controls['Year'].setErrors({ required: true });
    component.onSubmit();
    expect(component.Propertyform.touched).toBeTrue();
    expect(notificationService.sendAlert).toHaveBeenCalledWith(
      'Please fill out all required fields'
    );
  });

  it('should handle file input', () => {
    const mockFile = new File([''], 'filename', { type: 'image/png' });
    const mockEvent = { target: { files: [mockFile] } };

    component.handleFileInput(mockEvent);

    expect(component.file).toEqual(mockFile);
  });

  it('should show alert if no facility is selected', () => {
    component.Propertyform.controls['Picture'].setErrors(null);
    spyOn(notificationService, 'sendAlert');
    component.facilities = component.formBuilder.array(
      [] as FormControl<Facilities | null>[]
    );
    component.Propertyform.patchValue({
      Year: 2022,
      Name: 'Test Building',
      Country: 'Country',
      State: 'State',
      City: 'City',
      StreetNN: 'Street',
      ZipCode: '12345',
      Description: 'Building Description',
    });

    component.onSubmit();
    expect(notificationService.sendAlert).toHaveBeenCalledWith(
      'Please select at least one facility'
    );
  });

  it('should show alert if no condo, locker, or parking spot is added', () => {
    // Arrange
    component.Propertyform.controls['Picture'].setErrors(null);
    spyOn(notificationService, 'sendAlert');
    component.facilities = component.formBuilder.array(
      [] as FormControl<Facilities | null>[]
    );
    component.Propertyform.patchValue({
      Year: 2022,
      Name: 'Test Building',
      Country: 'Country',
      State: 'State',
      City: 'City',
      StreetNN: 'Street',
      ZipCode: '12345',
      Description: 'Building Description',
    });
    const event = { checked: true, source: { value: 'Playground' } };
    component.onCheckboxChange(event);

    component.CondoItems = [];
    component.LockerItems = [];
    component.ParkingItems = [];
    //Act
    component.onSubmit();
    expect(notificationService.sendAlert).toHaveBeenCalledWith(
      'Please add at least one of each:\n Condo, Locker, Parking Spot'
    );
  });

  it('should add a control when checkbox is checked', () => {
    component.facilities = component.formBuilder.array(
      [] as FormControl<Facilities | null>[]
    );
    const event = { checked: true, source: { value: 'Playground' } };
    component.onCheckboxChange(event);
    expect(component.facilities.length).toEqual(1);
    expect(component.facilities.at(0).value).toEqual(Facilities.Playground);
  });

  it('should remove a control when checkbox is unchecked', () => {
    component.facilities = component.formBuilder.array(
      [] as FormControl<Facilities | null>[]
    );
    const event = { checked: false, source: { value: 'Playground' } };
    component.facilities.push(new FormControl(Facilities.Playground));
    component.onCheckboxChange(event);
    expect(component.facilities.length).toEqual(0);
  });

  it('should add condos, lockers, and parkings to the building', fakeAsync(() => {
    spyOn(storageService, 'uploadToFirestore').and.returnValue(
      Promise.resolve('image-link')
    );
    spyOn(storageService, 'IDgenerator').and.returnValue(
      Promise.resolve('building-id')
    );
    spyOn(buildingService, 'addBuilding').and.returnValue(Promise.resolve());
    spyOn(notificationService, 'sendNotification');
    spyOn(component, 'reloadPage');

    //  component.facilities = component.formBuilder.array(
    //    [] as FormControl<Facilities | null>[]
    //  );

    component.Propertyform.patchValue({
      Year: 2022,
      Name: 'Test Building',
      Country: 'Country',
      State: 'State',
      City: 'City',
      StreetNN: 'Street',
      ZipCode: '12345',
      Description: 'Building Description',
      Picture: '',
    });

    const event = { checked: true, source: { value: 'Gym' } };
    component.onCheckboxChange(event);

    component.Propertyform.controls['Picture'].setErrors(null);

    component.CondoItems = [
      {
        Type: 'Rent',
        UnitNumber: 'Unit',
        Fee: 1000,
        Picture: condoImage,
        Description: 'Condo Description',
        NumberOfBedrooms: 2,
        NumberOfBathrooms: 2,
        SquareFootage: 1000,
        Quantity: 1,
      },
    ];

    component.LockerItems = [
      {
        Number: 'Locker',
        Height: '60cm',
        Width: '30cm',
        Length: '45cm',
        Fee: 100,
        Quantity: 1,
      },
    ];

    component.ParkingItems = [
      {
        Number: 'Parking',
        ParkingType: 'Standard',
        Fee: 50,
        Quantity: 1,
      },
    ];

    component.onSubmit();
    tick();

    expect(storageService.uploadToFirestore).toHaveBeenCalledTimes(2);
    expect(storageService.IDgenerator).toHaveBeenCalledWith(
      'buildings/',
      jasmine.any(Object)
    );
    expect(buildingService.addBuilding).toHaveBeenCalledWith({
      ID: '',
      Year: 2022,
      CompanyID: '',
      Name: 'Test Building',
      Address: 'Street, City, State, Country, 12345',
      Bookings: [],
      Description: 'Building Description',
      Parkings: [
        {
          ID: '',
          OccupantID: '',
          Number: 'Parking-2-0',
          Status: ParkingLockerStatus.Available,
          ParkingType: ParkingType.Standard,
          Fee: 50,
        },
      ],
      Lockers: [
        {
          ID: '',
          OccupantID: '',
          Number: 'Locker-1-0',
          Status: ParkingLockerStatus.Available,
          Height: '60cm',
          Width: '30cm',
          Length: '45cm',
          Fee: 100,
        },
      ],
      Condos: [
        {
          ID: '',
          Type: CondoType.Rent,
          OccupantID: '',
          UnitNumber: 'Unit-0-0',
          Fee: 1000,
          Picture: 'image-link',
          Description: 'Condo Description',
          NumberOfBedrooms: 2,
          NumberOfBathrooms: 2,
          Status: CondoStatus.Vacant,
          SquareFootage: 1000,
        },
      ],
      Picture: 'image-link',
      Facilities: [Facilities.Gym, Facilities.Locker, Facilities.Parking],
      Operations:[]
    });
    expect(notificationService.sendNotification).toHaveBeenCalledWith(
      'Property Added'
    );

    expect(component.reloadPage).toHaveBeenCalled();
  }));
});
