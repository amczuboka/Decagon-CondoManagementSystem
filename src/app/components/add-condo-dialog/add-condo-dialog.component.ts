import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AddNewPropertyComponent } from 'src/app/pages/add-new-property/add-new-property.component';
import { MyErrorStateMatcher } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';

/**
 * Component for adding a new condo through a dialog.
 */
@Component({
  selector: 'app-add-condo-dialog',
  templateUrl: './add-condo-dialog.component.html',
  styleUrls: ['./add-condo-dialog.component.scss'],
})
export class AddCondoDialogComponent implements OnInit {
  /** Form group for the new condo. */
  newCondo!: FormGroup<any>;

  /** Error state matcher for form validation. */
  matcher = new MyErrorStateMatcher();

  /** Holds the selected file. */
  public file!: any;

  /** Holds the image source for preview. */
  imageSrc: string | null = null;

  /**
   * Constructor for AddCondoDialogComponent.
   *
   * @param dialogRef - Reference to the MatDialog used for this component.
   * @param data - Data passed to the dialog.
   * @param formBuilder - FormBuilder for creating form groups.
   * @param notification - NotificationService for displaying notifications.
   */
  constructor(
    public dialogRef: MatDialogRef<AddNewPropertyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private notification: NotificationService
  ) {}

  /**
   * Lifecycle hook that is called after data-bound properties of the directive are initialized.
   */
  ngOnInit(): void {
    this.newCondo = this.formBuilder.group({
      SquareFootage: ['', [Validators.required]],
      NumberOfBedrooms: ['', [Validators.required]],
      NumberOfBathrooms: ['', [Validators.required]],
      Type: ['', [Validators.required]],
      Fee: ['', [Validators.required]],
      Quantity: ['', [Validators.required]],
      Picture: [null, [Validators.required]],
      PictureScr: ['', [Validators.required]],
      Description: ['', [Validators.required]],
      UnitNumber: ['', [Validators.required]],
    });
  }

  /**
   * Handles the file input change event.
   *
   * @param event - The file input change event.
   */
  handleFileInput(event: any): void {
    if (event.target.files && event.target.files[0]) {
      this.file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageSrc = reader.result as string;
        this.newCondo.controls['PictureScr'].markAsDirty();
        this.newCondo.controls['PictureScr'].setValue(this.imageSrc);
      };
      reader.readAsDataURL(this.file);
    }
  }

  /**
   * Saves the new condo item.
   */
  saveItem(): void {
    this.newCondo.value.Picture = this.file;
    const { valid, value } = this.newCondo;
    if (valid) {
      this.dialogRef.close(value); // Pass the new item data when closing the dialog
    } else {
      this.notification.sendNotification('Make sure to fill all the fields!');
    }
  }
}
