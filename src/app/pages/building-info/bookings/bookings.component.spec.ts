import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from 'src/app/app.module';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';

import { BookingsComponent } from './bookings.component';
import { Booking, Building, Facilities } from 'src/app/models/properties';
import { Validators } from '@angular/forms';

describe('BookingsComponent', () => {
  let component: BookingsComponent;
  let fixture: ComponentFixture<BookingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
        MatDividerModule,
        MatRadioModule,
        MatCardModule,
        MatIconModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatButtonModule,
        MatChipsModule,
      ],
      declarations: [BookingsComponent],
    });
    fixture = TestBed.createComponent(BookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

          const building: Building = {
            ID: '1',
            Name: 'Building A',
            Year: 2001,
            CompanyID: '',
            Address: '',
            Bookings: [
              {
                ID: '1',
                OccupantID: '1',
                Date: new Date(2022, 0, 1, 9).valueOf(),
                Facility: Facilities.Spa,
              },
              {
                ID: '1',
                OccupantID: '1',
                Date: new Date(2022, 0, 1, 9).valueOf(),
                Facility: Facilities.Pool,
              },
            ],
            Description: '',
            Parkings: [],
            Lockers: [],
            Condos: [],
            Picture: '',
            Facilities: [Facilities.Gym, Facilities.Pool],
          };

          component.building = building;

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      const building: Building = {
        ID: '1',
        Name: 'Building A',
        Year: 2001,
        CompanyID: '',
        Address: '',
        Bookings: [],
        Description: '',
        Parkings: [],
        Lockers: [],
        Condos: [],
        Picture: '',
        Facilities: [Facilities.Gym, Facilities.Pool],
      };

      component.building = building;
    });
    it('should initialize building facilities', () => {
      component.ngOnInit();

      expect(component.buildingFacilities).toEqual([
        Facilities.Gym,
        Facilities.Pool,
      ]);
    });

    it('should subscribe to facility field changes', async () => {
      await component.ngOnInit();
      const facilityControl = component.bookFacilityForm.get('facility');
      facilityControl?.setValue('Gym');
      expect(component.facility).toBe('Gym');
   
    });

    it('should subscribe to date field changes', async () => {
      await component.ngOnInit();
      const dateControl = component.bookFacilityForm.get('date');
      dateControl?.setValue(new Date());
      expect(component.date).toBeGreaterThan(0);
   
    });

  });

  describe('bookableFacilities', () => {
    it('should filter out non-bookable facilities', () => {
      const facilities: Facilities[] = [
        Facilities.Gym,
        Facilities.Locker,
        Facilities.Parking,
        Facilities.Playground,
        Facilities.Spa, //bookable
        Facilities.MeetingRoom, //bookable
        Facilities.Pool, //bookable
      ];

      const bookable = component.bookableFacilities(facilities);

      // Verify that non-bookable facilities are excluded
      expect(bookable).not.toContain(Facilities.Gym);
      expect(bookable).not.toContain(Facilities.Locker);
      expect(bookable).not.toContain(Facilities.Parking);
      expect(bookable).not.toContain(Facilities.Playground);

      // Verify that bookable facilities are included
      expect(bookable).toContain(Facilities.Spa);
      expect(bookable).toContain(Facilities.MeetingRoom);
      expect(bookable).toContain(Facilities.Pool);
    });
  });

  it('should submit the form and create a new booking', async () => {
    // Arrange

    component.bookFacilityForm = component.form_builder.group({
      date: ['', [Validators.required]],
      facility: ['', [Validators.required]],
      'time-slot': [[], [Validators.required]],
      myUserID: [''],
    });
    const mockBuildingID = 'mockBuildingID';

    const building: Building = {
      ID: mockBuildingID,
      Name: 'Building A',
      Year: 2001,
      CompanyID: '',
      Address: '',
      Bookings: [],
      Description: '',
      Parkings: [],
      Lockers: [],
      Condos: [],
      Picture: '',
      Facilities: [],
    };

    const mockBooking: Booking = {
      ID: '',
      OccupantID: 'mockUserID',
      Facility: Facilities.Gym,
      Date: new Date(2022, 0, 1).valueOf(), // mock date value
    };
    const mockFormValue = {
      myUserID: 'mockUserID',
      date: new Date(2022, 0, 1), // mock date value
      facility: Facilities.Gym,
      'time-slot': 0, // mock time slot value
    };
    const mockDateObject = new Date(2022, 0, 1); // mock date object

    spyOn(component.notificationService, 'sendAlert'); // Change access modifier to public
    spyOn(component.authService, 'getUser').and.returnValue({
      uid: 'mockUserID',
    });

    spyOn(component.bookingsService, 'addNewBooking').and.returnValue(
      Promise.resolve()
    );


    // Act
    component.date = mockDateObject.valueOf();
    component.building = building;

    // Use setValue or patchValue to set the values
    component.bookFacilityForm.controls['date'].setValue(mockFormValue.date);
    component.bookFacilityForm.controls['facility'].setValue(
      mockFormValue.facility
    );
    component.bookFacilityForm.controls['time-slot'].setValue(
      mockFormValue['time-slot']
    );
    component.bookFacilityForm.controls['myUserID'].setValue(
      mockFormValue.myUserID
    );

    await component.onSubmit();

    // Assert

    expect(component.authService.getUser).toHaveBeenCalled();

    expect(component.buildingID).toBe(mockBuildingID);



    expect(component.bookingsService.addNewBooking).toHaveBeenCalledWith(
      mockBuildingID,
      mockBooking
    );
  });

it('should update time slots when both date and facility are selected', async () => {
  // Arrange
  component.date = new  Date(2022, 0, 1).valueOf();
  component.facility = Facilities.Spa;




  spyOn(component.buildingService, 'getBuilding').and.returnValue(
    Promise.resolve(component.building)
  );

  // Act
  await component.updateTimeSlots();

  // Assert

  expect(component.TimeSlots).toEqual([
    { value: 10, time: '10:00 am' },
    { value: 11, time: '11:00 am' },
    { value: 12, time: '12:00 pm' },
    { value: 13, time: '1:00 pm' },
    { value: 14, time: '2:00 pm' },
    { value: 15, time: '3:00 pm' },
    { value: 16, time: '4:00 pm' },
  ]);
  expect(component.buildingService.getBuilding).toHaveBeenCalledWith(
    component.building.ID
  );
});

it('should not update time slots when either date or facility is not selected', async () => {
  // Arrange
  component.date = 0;
  component.facility = Facilities.Gym;

 
  spyOn(component.buildingService, 'getBuilding');

  // Act
  await component.updateTimeSlots();

  // Assert
 
  expect(component.buildingService.getBuilding).not.toHaveBeenCalled();

  expect(component.TimeSlots).toEqual([
    { value: 9, time: '9:00 am' },
    { value: 10, time: '10:00 am' },
    { value: 11, time: '11:00 am' },
    { value: 12, time: '12:00 pm' },
    { value: 13, time: '1:00 pm' },
    { value: 14, time: '2:00 pm' },
    { value: 15, time: '3:00 pm' },
    { value: 16, time: '4:00 pm' },
  ]);
});


});
