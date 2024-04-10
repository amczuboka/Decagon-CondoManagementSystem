import { AfterViewChecked, Component, Input } from '@angular/core';
import { FormGroup, Validators, FormBuilder} from '@angular/forms'
import { Booking, Building, Facilities } from 'src/app/models/properties';
import { User} from 'src/app/models/users';
import { MyErrorStateMatcher } from 'src/app/services/auth.service';
import { AuthService } from 'src/app/services/auth.service';
import { BookingsService } from 'src/app/services/bookings.service';
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

  constructor(
    private form_builder: FormBuilder,
    private authService: AuthService,
    private bookingsService: BookingsService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {

   //Initialize building facilities
   this.buildingFacilities = this.building.Facilities;
   this.bookable = this.bookableFacilities(this.buildingFacilities);

   //Book Facility Form 
    this.bookFacilityForm = this.form_builder.group({
      'date': ['', [Validators.required]],
      'facility': ['', [Validators.required]],
      'time-slot': [[], [Validators.required]],
      myUserID: ['']
    });

   //Subscribe to facility field changes
   this.bookFacilityForm.get('facility')!.valueChanges.subscribe((selectedFacility)=>{
    this.facility = selectedFacility;
    console.log(this.facility);
    this.updateTimeSlots()
   });

   //Subscribe to date field changes
   this.bookFacilityForm.get('date')!.valueChanges.subscribe((selectedDate)=>{
    const dateAsNum = selectedDate.getTime();
    this.date = dateAsNum;
    console.log(this.date);
    this.updateTimeSlots()
   });

  }

  bookableFacilities(buildingFacilities: Facilities[]): Facilities[] {
    const bookable: Facilities[]=[];

    buildingFacilities.forEach(facility => {
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
   * Console log selected time slot
   */
  logTimeSlots(){
    const selectedTimeSlot = this.bookFacilityForm.get('time-slot')?.value;
    console.log('Selected time slot', selectedTimeSlot);
  }

  /**
   * Function to update time slots
   */
  updateTimeSlots(){
    if (this.date && this.facility){
      console.log("Both date and facility have been selected");
      //Implement logic to update time slots
      //console.log(this.building.Bookings);
    } else {
      console.log("Not both have been selected");
      //do nothing
    } 
  }

  
  onSubmit(){
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
    const booking: Booking = {
      ID: '',
      OccupantID: formData.myUserID,
      Facility: formData.facility,
      Date: this.date,
      TimeSlot: formData['time-slot'],
    };
    console.log(formData);

    //Creating new booking
    this.bookingsService.addNewBooking(this.buildingID, booking).then(()=>{
      this.notificationService.sendNotification('Booking successfully created!');
    });
    

  }

}
