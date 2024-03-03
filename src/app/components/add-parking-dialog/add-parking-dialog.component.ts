import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AddNewPropertyComponent } from 'src/app/pages/add-new-property/add-new-property.component';
import { MyErrorStateMatcher } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';

/**
 * Component for adding a parking space through a dialog.
 */
@Component({
  selector: 'app-add-parking-dialog',
  templateUrl: './add-parking-dialog.component.html',
  styleUrls: ['./add-parking-dialog.component.scss'],
})
export class AddParkingDialogComponent {
  /** Form group for the new parking space. */
  newParking!: FormGroup<any>;

  /** Instance of the error state matcher. */
  matcher = new MyErrorStateMatcher();

  /**
   * Constructor for AddParkingDialogComponent.
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
    this.newParking = this.form_builder.group({
      Number: ['', [Validators.required]],
      ParkingType: ['', [Validators.required]],
      Fee: ['', [Validators.required]],
      Quantity: ['', [Validators.required]],
    });
  }

  /**
   * Saves the new parking space item.
   * If the form is valid, it closes the dialog and passes the new item data.
   * If the form is invalid, it displays a notification.
   */
  saveItem(): void {
    const { valid, value } = this.newParking;
    if (valid) {
      this.onCloseClick(value); // Pass the new item data when closing the dialog
    } else {
      this.notification.sendNotification('Make sure to fill all the fields!');
    }
  }

  onCloseClick(value: any): void {
    this.dialogRef.close(value);
  }
}
