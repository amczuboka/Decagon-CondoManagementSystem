import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-new-building-operation',
  templateUrl: './add-new-building-operation.component.html',
  styleUrls: ['./add-new-building-operation.component.scss']
})
export class AddNewBuildingOperationComponent implements OnInit {
  operationForm!: FormGroup;
  submitted: boolean = false;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.operationForm = this.formBuilder.group({
      operationName: ['', Validators.required],
      description: ['', Validators.required],
      cost: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      building: ['', Validators.required]
    });
  }

  // Convenience getter for easy access to form fields
  get f() {
    return this.operationForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // Stop here if form is invalid
    if (this.operationForm.invalid) {
      return;
    }

    // Proceed with form submission
    console.log('Form submitted successfully!');
  }
}
