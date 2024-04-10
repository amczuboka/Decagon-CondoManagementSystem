import { Component, Input } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms'
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
      date: ['', [Validators.required]],
      facility: ['', [Validators.required]],
      'time-slots': [[], [Validators.required]],
    });
  }

  onSubmit(){
    this.bookFacilityForm.markAllAsTouched();
  }
}
