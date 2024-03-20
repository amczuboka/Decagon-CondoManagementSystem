import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-request-page',
  templateUrl: './request-page.component.html',
  styleUrls: ['./request-page.component.scss']
})
export class RequestPageComponent {

  requestForm!: FormGroup;
  requestTypes = ['Move In / Move Out', 'Intercome Changes', 'Report Violation / Deficiency', 'Request Access', 'General Questions'];

  constructor(private formBuilder: FormBuilder, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
      this.requestForm = this.formBuilder.group({
          RequestType: ['', Validators.required],
          Comments: [''],
      });
  }

  onSubmit(): void {
      console.warn('Your order has been submitted', this.requestForm.value);
      if (this.requestForm.invalid) {
          console.log('Form is invalid');
          this.openSnackBar('You must select a request type.');
      } else {
          console.log('Form is valid');
          this.openSnackBar('Your request has been submitted.');
      }
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, '', {
       duration: 5000, 
       horizontalPosition: 'center',
       verticalPosition: 'top',
      });
  }

}
