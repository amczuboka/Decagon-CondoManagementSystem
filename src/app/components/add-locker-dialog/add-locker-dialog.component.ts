import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AddNewPropertyComponent } from 'src/app/pages/add-new-property/add-new-property.component';
import { MyErrorStateMatcher } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';

/**
 * Component for adding a locker through a dialog.
 */
@Component({
  selector: 'app-add-locker-dialog',
  templateUrl: './add-locker-dialog.component.html',
  styleUrls: ['./add-locker-dialog.component.scss'],
})
export class AddLockerDialogComponent {
  /** Form group for the new locker. */
  newLocker!: FormGroup<any>;

  /** Instance of the error state matcher. */
  matcher = new MyErrorStateMatcher();

  /**
   * Constructor for AddLockerDialogComponent.
   *
   * @param dialogRef - Reference to the dialog.
   * @param data - Data passed to the dialog.
   * @param form_builder - FormBuilder for creating form groups.
   * @param notification - NotificationService for displaying notifications.
   */
  constructor(
    public dialogRef: MatDialogRef<AddNewPropertyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private form_builder: FormBuilder,
    public notification: NotificationService
  ) {}

  /**
   * Initializes the component.
   */
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

  /**
   * Saves the new locker item.
   * If the form is valid, it constructs the locker data and closes the dialog.
   * If the form is invalid, it displays a notification.
   */
  saveItem(): void {
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
      this.onCloseClick(toSend); // Pass the new item data when closing the dialog
    } else {
      this.notification.sendNotification('Make sure to fill all the fields!');
    }
  }

  onCloseClick(value: any): void {
    this.dialogRef.close(value);
  }
}
