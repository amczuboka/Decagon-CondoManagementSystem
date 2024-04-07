import { Component, Input } from '@angular/core';
import { FormGroup, Validators, FormBuilder} from '@angular/forms'
import { Booking, Building, Facilities } from 'src/app/models/properties';
import { MyErrorStateMatcher } from 'src/app/services/auth.service';

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
  selected: any;

  minDate = new Date();
  currentYear = this.minDate.getUTCFullYear();
  currentMonth = this.minDate.getUTCMonth();
  currentDay = this.minDate.getUTCDate();

  constructor(private form_builder: FormBuilder) {}

  ngOnInit(): void {
    this.bookFacilityForm = this.form_builder.group({
      'date': ['', [Validators.required]],
      'facility': ['', [Validators.required]],
      'time-slot': [[], [Validators.required]],
    });

   //Subscribe to facility field changes
   this.bookFacilityForm.get('facility')!.valueChanges.subscribe((selectedFacility)=>{
    console.log(selectedFacility);
   });

   //Subscribe to date field changes
   this.bookFacilityForm.get('date')!.valueChanges.subscribe((selectedDate)=>{
    console.log(selectedDate);
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
   * Function to update time slots based on selected date
   * @param event 
   */
  updateTimeSlots(event:any){
    const selectedDate = event.value;   //Getting selected date from datepicker
    console.log(selectedDate);

    //Add logic to update time slots here
    
  }

  onSubmit(){
    this.bookFacilityForm.markAllAsTouched();
  }

}
