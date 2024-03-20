import { Component, Input } from '@angular/core';
import { FormGroup, Validators, ReactiveFormsModule, FormBuilder, FormControl } from '@angular/forms'
import { FormsModule } from '@angular/forms';
import { Building } from 'src/app/models/properties';

@Component({
  selector: 'app-bookings',
  templateUrl:'./bookings.component.html',
  styleUrls: ['./bookings.component.scss']
})
export class BookingsComponent {

  @Input() building!: Building;
  @Input() sourcePage!: string;

  bookFacilityForm!: FormGroup<any>;
  selected: any;

  minDate = new Date();
  currentYear = this.minDate.getUTCFullYear();
  currentMonth = this.minDate.getUTCMonth();
  currentDay = this.minDate.getUTCDate();


  constructor(
    private form_builder: FormBuilder
  ){}


  ngOnInit(): void {
    this.bookFacilityForm = this.form_builder.group({

      date: ['', [Validators.required]],
      facility: ['', [Validators.required]],
      'time-slots':[[], [Validators.required]],
        
    });
  }




}
