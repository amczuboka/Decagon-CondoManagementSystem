import { AfterViewChecked, Component, Input } from '@angular/core';
import { FormGroup, Validators, FormBuilder} from '@angular/forms'
import { Booking, Building, Facilities } from 'src/app/models/properties';
import { MyErrorStateMatcher } from 'src/app/services/auth.service';
import { AuthService } from 'src/app/services/auth.service';

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
  myUser!: any;

  minDate = new Date();
  currentYear = this.minDate.getUTCFullYear();
  currentMonth = this.minDate.getUTCMonth();
  currentDay = this.minDate.getUTCDate();

  constructor(
    private form_builder: FormBuilder,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.bookFacilityForm = this.form_builder.group({
      'date': ['', [Validators.required]],
      'facility': ['', [Validators.required]],
      'time-slot': [[], [Validators.required]],
      myUser: []
    });

   //Get User
   this.myUser = this.authService.getUser();
   this.bookFacilityForm.patchValue({ myUser: this.myUser });

   //Subscribe to facility field changes
   this.bookFacilityForm.get('facility')!.valueChanges.subscribe((selectedFacility)=>{
    this.facility = selectedFacility;
    console.log(this.facility);
    this.updateTimeSlots()
   });

   //Subscribe to date field changes
   this.bookFacilityForm.get('date')!.valueChanges.subscribe((selectedDate)=>{
    this.date = selectedDate;
    console.log(this.date);
    this.updateTimeSlots()
   });

  }

  /**
   * Function that returns true if a facility should be able to be booked by a user. Otherwise, returns false.
   * @param facility 
   * @returns true if the facility is bookable. Otherwise, returns false.
   */
  bookableFacility(facility: string): boolean {
    switch (facility) {
      case Facilities.Gym:
        return false;
      case Facilities.Pool:
        return true;
      case Facilities.Spa:
        return true;
      case Facilities.Locker:
        return false;
      case Facilities.Parking:
        return false;
      case Facilities.Playground:
        return false;
      case Facilities.MeetingRoom:
        return true;
      default:
        return false;
    }
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
    console.log(this.bookFacilityForm.value);
  }

}
