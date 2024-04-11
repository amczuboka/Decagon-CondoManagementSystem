import { Component, Input } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { getDatabase } from 'firebase/database';
import {
  Booking,
  Building,
  Facilities,
  TimesAvailable,
} from 'src/app/models/properties';
import { User } from 'src/app/models/users';
import { MyErrorStateMatcher } from 'src/app/services/auth.service';
import { AuthService } from 'src/app/services/auth.service';
import { BookingsService } from 'src/app/services/bookings.service';
import { BuildingService } from 'src/app/services/building.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss'],
})
export class BookingsComponent {
  @Input() building!: Building;
  @Input() sourcePage!: string;

  matcher = new MyErrorStateMatcher();
  bookFacilityForm!: FormGroup<any>;
  facility!: string;
  date!: number;
  myUser!: User;
  myUserID!: string;
  buildingID!: string;

  buildingFacilities!: Facilities[];
  bookable!: Facilities[];

  minDate = new Date();
  currentYear = this.minDate.getUTCFullYear();
  currentMonth = this.minDate.getUTCMonth();
  currentDay = this.minDate.getUTCDate();

  TimeSlots!: TimesAvailable[];

  constructor(
    private form_builder: FormBuilder,
    private authService: AuthService,
    private bookingsService: BookingsService,
    private notificationService: NotificationService,
    private buildingService: BuildingService
  ) {
    this.TimeSlots = [
      { value: 9, time: '9:00 am' },
      { value: 10, time: '10:00 am' },
      { value: 11, time: '11:00 am' },
      { value: 12, time: '12:00 pm' },
      { value: 13, time: '1:00 pm' },
      { value: 14, time: '2:00 pm' },
      { value: 15, time: '3:00 pm' },
      { value: 16, time: '4:00 pm' },
    ];
  }

  async ngOnInit() {
    //Initialize building facilities
    this.buildingFacilities = await this.building.Facilities;
    this.bookable = await this.bookableFacilities(this.buildingFacilities);

    //Book Facility Form
    this.bookFacilityForm = this.form_builder.group({
      date: ['', [Validators.required]],
      facility: ['', [Validators.required]],
      'time-slot': [[], [Validators.required]],
      myUserID: [''],
    });

    //Subscribe to facility field changes
    this.bookFacilityForm
      .get('facility')!
      .valueChanges.subscribe((selectedFacility) => {
        this.facility = selectedFacility;
        console.log(this.facility);
        this.updateTimeSlots();
      });

    //Subscribe to date field changes
    this.bookFacilityForm
      .get('date')!
      .valueChanges.subscribe((selectedDate) => {
        const dateAsNum = selectedDate.getTime();
        this.date = dateAsNum;
        this.updateTimeSlots();
      });
  }

  bookableFacilities(buildingFacilities: Facilities[]): Facilities[] {
    const bookable: Facilities[] = [];

    buildingFacilities.forEach((facility) => {
      switch (facility) {
        case Facilities.Gym:
        case Facilities.Locker:
        case Facilities.Parking:
        case Facilities.Playground:
          break; // Not bookable, so skip
        default:
          bookable.push(facility); // Bookable, so add to array
      }
    });

    return bookable;
  }


  /**
   * Function to update time slots
   */
  async updateTimeSlots() {
    if (this.date && this.facility) {
      console.log('Both date and facility have been selected');
      this.TimeSlots = [
        { value: 9, time: '9:00 am' },
        { value: 10, time: '10:00 am' },
        { value: 11, time: '11:00 am' },
        { value: 12, time: '12:00 pm' },
        { value: 13, time: '1:00 pm' },
        { value: 14, time: '2:00 pm' },
        { value: 15, time: '3:00 pm' },
        { value: 16, time: '4:00 pm' },
      ];
      try{
          (
        await this.buildingService.getBuilding(this.building.ID)
      ).Bookings.forEach((booking) => {
        console.log(booking);
        let Bookdate = new Date(booking.Date);
        let selectedDate = new Date(this.date);

        // Create new Date objects for Bookdate and selectedDate that have the same time
        let BookdateWithoutTime = new Date(
          Bookdate.getFullYear(),
          Bookdate.getMonth(),
          Bookdate.getDate()
        );
        let selectedDateWithoutTime = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate()
        );

        // Compare BookdateWithoutTime and selectedDateWithoutTime
        if (
          BookdateWithoutTime.getTime() === selectedDateWithoutTime.getTime() &&
          booking.Facility === this.facility
        ) {
          // The dates are the same (not considering time)
          this.TimeSlots = this.TimeSlots.filter(
            (slot) => slot.value !== Bookdate.getHours()
          );
        }
        console.log(this.TimeSlots);
      });
      }catch(error){
        console.log('Error getting building', error);
      } 
    
    } else {
      console.log('Not both have been selected');
      //do nothing
    }
  }

  async onSubmit() {
    this.bookFacilityForm.markAllAsTouched();
    if (this.bookFacilityForm.invalid) {
      this.notificationService.sendAlert('Please fill out all required fields');
      return;
    }

    //Getting User
    this.myUser = this.authService.getUser();
    this.myUserID = this.myUser.uid;
    this.bookFacilityForm.patchValue({ myUserID: this.myUserID });

    //Getting building id
    this.buildingID = this.building.ID;

    //Obtaining object from form
    const formData = this.bookFacilityForm.value;
    let dateObject = new Date(this.date);
    dateObject.setHours(formData['time-slot'], 0, 0);
    this.date = dateObject.valueOf();

    console.log(dateObject, 'date in letters\n', this.date);
    const db = getDatabase();

    const booking: Booking = {
      ID: '',
      OccupantID: formData.myUserID,
      Facility: formData.facility,
      Date: this.date,
    };
    console.log(formData);

    //Creating new booking
    await this.bookingsService.addNewBooking(this.buildingID, booking).then(() => {
      this.notificationService.sendNotification(
        'Booking successfully created!'
      );
    });

    this.bookFacilityForm.reset();
    Object.values(this.bookFacilityForm.controls).forEach((control) => {
      control.markAsUntouched();
    });
  }
}
