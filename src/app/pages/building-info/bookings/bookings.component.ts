import { Component, Input } from '@angular/core';
import { FormGroup, Validators, ReactiveFormsModule, FormBuilder, FormControl } from '@angular/forms'
import { FormsModule } from '@angular/forms';
import { Building } from 'src/app/models/properties';
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
      'time-slots': [[], [Validators.required]],
    });
  }

  /**
   * Console log selected time slot
   */
  logTimeSlots(){
    const selectedTimeSlots = this.bookFacilityForm.get('time-slots')?.value;
    console.log('Selected time slots', selectedTimeSlots);
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
