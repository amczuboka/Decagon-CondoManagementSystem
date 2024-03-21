import { Component, Input, OnInit } from '@angular/core';
import {
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormBuilder,
  FormControl,
} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Building } from 'src/app/models/properties';

@Component({
  selector: 'app-building-overview',
  templateUrl: './building-overview.component.html',
  styleUrls: ['./building-overview.component.scss'],
})
export class BuildingOverviewComponent implements OnInit {
  @Input() building!: Building;

  bookFacilityForm!: FormGroup<any>;
  selected: any;

  minDate = new Date();
  currentYear = this.minDate.getUTCFullYear();
  currentMonth = this.minDate.getUTCMonth();
  currentDay = this.minDate.getUTCDate();

  constructor(private form_builder: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.bookFacilityForm = this.form_builder.group({
      date: ['', [Validators.required]],
      facility: ['', [Validators.required]],
      'time-slots': [[], [Validators.required]],
    });
  }

}
