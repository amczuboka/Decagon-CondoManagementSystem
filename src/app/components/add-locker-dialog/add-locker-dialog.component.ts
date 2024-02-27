import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AddNewPropertyComponent } from 'src/app/pages/add-new-property/add-new-property.component';
import { MyErrorStateMatcher } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-add-locker-dialog',
  templateUrl: './add-locker-dialog.component.html',
  styleUrls: ['./add-locker-dialog.component.scss'],
})
export class AddLockerDialogComponent {
  newLocker!: FormGroup<any>;
  form: any;
  matcher = new MyErrorStateMatcher();

  constructor(
    public dialogRef: MatDialogRef<AddNewPropertyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private form_builder: FormBuilder,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.newLocker = this.form_builder.group({
      Number: ['', [Validators.required]],
      Height: ['', [Validators.required]],
      HeightUnit: ['', [Validators.required]],
      Width: ['', [Validators.required]],
      WidthUnit: ['', [Validators.required]],
      Length: ['', [Validators.required]],
      LengthUnit: ['', [Validators.required]],
      Fee: ['', [Validators.required]],
      Quantity: ['', [Validators.required]],
    });
  }


  saveItem() {
    const { valid, value } = this.newLocker;
    if (valid) {
      const toSend = {
        Height: this.newLocker.value.Height + this.newLocker.value.HeightUnit,
        Width: this.newLocker.value.Width + this.newLocker.value.WidthUnit,
        Length: this.newLocker.value.Length + this.newLocker.value.LengthUnit,
        Number: this.newLocker.value.Number,
        Fee: this.newLocker.value.Fee,
        Quantity: this.newLocker.value.Quantity,
      };
      this.dialogRef.close(toSend); // Pass the new item data when closing the dialog
    } else {
      this.notification.sendNotification('Make sure to fill all the fields!');
    }
  }
}
