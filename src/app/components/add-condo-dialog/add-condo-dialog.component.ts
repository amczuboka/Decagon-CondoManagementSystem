import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AddNewPropertyComponent } from 'src/app/pages/add-new-property/add-new-property.component';
import { MyErrorStateMatcher } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-add-condo-dialog',
  templateUrl: './add-condo-dialog.component.html',
  styleUrls: ['./add-condo-dialog.component.scss'],
})
export class AddCondoDialogComponent {
  newCondo!: FormGroup<any>;
  form: any;
  matcher = new MyErrorStateMatcher();
  public file!: any;
  imageSrc: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<AddNewPropertyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private form_builder: FormBuilder,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.newCondo = this.form_builder.group({
      SquareFootage: ['', [Validators.required]],
      NumberOfBedrooms: ['', [Validators.required]],
      NumberOfBathrooms: ['', [Validators.required]],
      Type: ['', [Validators.required]],
      Fee: ['', [Validators.required]],
      Quantity: ['', [Validators.required]],
      Picture: [null, [Validators.required]],
      PictureScr: ['', [Validators.required]],
    });
  }

  handleFileInput(event: any) {
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

  saveItem() {
    this.newCondo.value.Picture = this.file;
    const { valid, value } = this.newCondo;
    if (valid) {
      this.dialogRef.close(value); // Pass the new item data when closing the dialog
    }else{
      this.notification.sendNotification('Make sure to fill all the fields!');
    }
    
  }
}
