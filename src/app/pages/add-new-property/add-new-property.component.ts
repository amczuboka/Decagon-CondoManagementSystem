import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddCondoDialogComponent } from 'src/app/components/add-condo-dialog/add-condo-dialog.component';
import { AddLockerDialogComponent } from 'src/app/components/add-locker-dialog/add-locker-dialog.component';
import { AddParkingDialogComponent } from 'src/app/components/add-parking-dialog/add-parking-dialog.component';
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
  CondoItems: any[] = [];
  LockerItems: any[] = [];
  ParkingItems: any[] = [];

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
      Description: ['', Validators.required],
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
        this.CondoItems.push(newItem);
      }
    });
  }

  //Function to open "add new item dialog"
  openAddLockerDialog(): void {
    let dialogRef = this.dialog.open(AddLockerDialogComponent, {
      panelClass: 'responsive-dialog',
      maxHeight: '90vh',
    });

    dialogRef.afterClosed().subscribe((newItem) => {
      console.log('The dialog was closed');
      if (newItem) {
        // Handle the newly added item here
        console.log('New item added:', newItem);
        this.LockerItems.push(newItem);
      }
    });
  }
  //Function to open "add new item dialog"
  openAddParkingDialog(): void {
    let dialogRef = this.dialog.open(AddParkingDialogComponent, {
      panelClass: 'responsive-dialog',
      maxHeight: '90vh',
    });

    dialogRef.afterClosed().subscribe((newItem) => {
      console.log('The dialog was closed');
      if (newItem) {
        // Handle the newly added item here
        console.log('New item added:', newItem);
        this.ParkingItems.push(newItem);
      }
    });
  }

  deleteCondoItems(item: any) {
    // Delete the item from the deliveryItems array
    this.CondoItems.splice(this.CondoItems.indexOf(item), 1);
    console.log('Item deleted:', item);
    console.log(this.CondoItems);
  }

  deleteLockerItems(item: any) {
    // Delete the item from the deliveryItems array
    this.LockerItems.splice(this.LockerItems.indexOf(item), 1);
    console.log('Item deleted:', item);
    console.log(this.LockerItems);
  }

  deleteParkingItems(item: any) {
    // Delete the item from the deliveryItems array
    this.ParkingItems.splice(this.ParkingItems.indexOf(item), 1);
    console.log('Item deleted:', item);
    console.log(this.ParkingItems);
  }

  onSubmit() {
    // this.loading = true;

    Object.keys(this.Propertyform.controls).forEach((key) => {
      if (this.Propertyform.controls[key].valid) {
        console.log(key + ' is valid');
      } else {
        console.log(key + ' is not valid');
      }
    });

    console.log(this.Propertyform.value);

    this.loading = false;
  }
}
