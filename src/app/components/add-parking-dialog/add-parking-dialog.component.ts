import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AddNewPropertyComponent } from 'src/app/pages/add-new-property/add-new-property.component';
import { MyErrorStateMatcher } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-add-parking-dialog',
  templateUrl: './add-parking-dialog.component.html',
  styleUrls: ['./add-parking-dialog.component.scss'],
})
export class AddParkingDialogComponent {
  newParking!: FormGroup<any>;
  form: any;
  matcher = new MyErrorStateMatcher();

  constructor(
    public dialogRef: MatDialogRef<AddNewPropertyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private form_builder: FormBuilder,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.newParking = this.form_builder.group({
      Number: ['', [Validators.required]],
      ParkingType: ['', [Validators.required]],
      Fee: ['', [Validators.required]],
      Quantity: ['', [Validators.required]],
    });
  }

  saveItem() {
    const { valid, value } = this.newParking;
    if (valid) {
      this.dialogRef.close(value); // Pass the new item data when closing the dialog
    } else {
      this.notification.sendNotification('Make sure to fill all the fields!');
    }
  }
}
