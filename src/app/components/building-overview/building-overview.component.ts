import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, ReactiveFormsModule, FormBuilder, FormControl } from '@angular/forms'
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-building-overview',
  templateUrl: './building-overview.component.html',
  styleUrls: ['./building-overview.component.scss']
})
export class BuildingOverviewComponent implements OnInit{

  bookFacilityForm!: FormGroup<any>;

  constructor(
    private form_builder: FormBuilder
  ){}


  ngOnInit(): void {
    this.bookFacilityForm = this.form_builder.group({

      date: ['', [Validators.required]],
      facility: ['', [Validators.required]]
        
    });
  }

}
    
 
    
    

  


