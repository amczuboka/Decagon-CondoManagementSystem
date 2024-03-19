import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms'

@Component({
  selector: 'app-building-overview',
  templateUrl: './building-overview.component.html',
  styleUrls: ['./building-overview.component.scss']
})
export class BuildingOverviewComponent implements OnInit{

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
    
 
    
    

  


