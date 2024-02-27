import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddCondoDialogComponent } from 'src/app/components/add-condo-dialog/add-condo-dialog.component';
import { MyErrorStateMatcher } from 'src/app/services/auth.service';

@Component({
  selector: 'app-add-new-property',
  templateUrl: './add-new-property.component.html',
  styleUrls: ['./add-new-property.component.scss'],
})
export class AddNewPropertyComponent {
  Propertyform!: FormGroup;
  loading: boolean = false;
  //for the error message in the form
  matcher = new MyErrorStateMatcher();
  //for the icons in password field
  hide = true;
  currentYear = new Date().getFullYear();
  public file!: any;
  facilities = this.formBuilder.array([] as FormControl[]);

  constructor(private formBuilder: FormBuilder, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.Propertyform = this.formBuilder.group({
      Year: ['', Validators.required],
      Name: ['', Validators.required],
      Contry: ['', Validators.required],
      State: ['', Validators.required],
      City: ['', Validators.required],
      StreetNN: ['', Validators.required],
      ZipCode: ['', Validators.required],
      // Bookings: this.fb.array([]), // You might want to create a form array or a form group for these
      Description: ['', Validators.required],
      // Parkings: this.fb.array([]), // You might want to create a form array or a form group for these
      // Lockers: this.fb.array([]), // You might want to create a form array or a form group for these
      // Condos: this.fb.array([]), // You might want to create a form array or a form group for these
      Picture: [null, Validators.required],
      Facilities: this.facilities,
    });
  }

  handleFileInput(event: any) {
    this.file = event.target.files[0];
  }

  onCheckboxChange(e: any) {
    if (e.checked) {
      this.facilities.push(new FormControl(e.source.value));
    } else {
      let i: number = 0;
      this.facilities.controls.forEach((item: FormControl) => {
        if (item.value == e.source.value) {
          this.facilities.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  //Function to open "add new item dialog"
  openAddCondoDialog(): void {
    let dialogRef = this.dialog.open(AddCondoDialogComponent, {
      panelClass: 'responsive-dialog',
      maxHeight: '90vh',
    });

    dialogRef.afterClosed().subscribe((newItem) => {
      console.log('The dialog was closed');
      if (newItem) {
        // Handle the newly added item here
        console.log('New item added:', newItem);
        // this.deliveryItems.push(newItem);
      }
    });
  }

  onSubmit() {
    console.log(this.Propertyform.value);
  }
}
