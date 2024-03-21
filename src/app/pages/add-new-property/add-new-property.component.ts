import { NotificationService } from './../../services/notification.service';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { getDatabase } from 'firebase/database';
import { AddCondoDialogComponent } from 'src/app/pages/add-new-property/add-condo-dialog/add-condo-dialog.component';
import { AddLockerDialogComponent } from 'src/app/pages/add-new-property/add-locker-dialog/add-locker-dialog.component';
import { AddParkingDialogComponent } from 'src/app/pages/add-new-property/add-parking-dialog/add-parking-dialog.component';
import {
  Building,
  Condo,
  CondoStatus,
  Facilities,
  Locker,
  ParkingLockerStatus,
  ParkingSpot,
} from 'src/app/models/properties';
import { MyErrorStateMatcher } from 'src/app/services/auth.service';
import { BuildingService } from 'src/app/services/building.service';
import { StorageService } from 'src/app/services/storage.service';
import { timeout } from 'rxjs';

/**
 * Component for adding a new property.
 */
@Component({
  selector: 'app-add-new-property',
  templateUrl: './add-new-property.component.html',
  styleUrls: ['./add-new-property.component.scss'],
})
export class AddNewPropertyComponent {
  /** Form group for the new property. */
  Propertyform!: FormGroup;
  /** Loading indicator for form submission. */
  loading: boolean = false;
  /** Error state matcher for form validation. */
  matcher = new MyErrorStateMatcher();
  /** Boolean flag to toggle password visibility. */
  hide = true;
  /** Current year. */
  currentYear = new Date().getFullYear();
  /** File for property picture. */
  public file!: any;
  /** Form array for facilities checkboxes. */
  facilities = this.formBuilder.array([] as FormControl<Facilities | null>[]);
  /** Array to store condo items. */
  CondoItems: any[] = [];
  /** Array to store locker items. */
  LockerItems: any[] = [];
  /** Array to store parking items. */
  ParkingItems: any[] = [];

  /**
   * Constructor for AddNewPropertyComponent.
   *
   * @param formBuilder - FormBuilder for creating form groups.
   * @param dialog - MatDialog for opening dialogs.
   * @param BuildingService - BuildingService for managing building data.
   * @param storageService - StorageService for handling file uploads.
   * @param NotificationService - NotificationService for displaying notifications.
   */
  constructor(
    public formBuilder: FormBuilder,
    public dialog: MatDialog,
    public BuildingService: BuildingService,
    public storageService: StorageService,
    public NotificationService: NotificationService
  ) {}

  /**
   * Initializes the component.
   */
  ngOnInit(): void {
    this.Propertyform = this.formBuilder.group({
      Year: ['', Validators.required],
      Name: ['', Validators.required],
      Country: ['', Validators.required],
      State: ['', Validators.required],
      City: ['', Validators.required],
      StreetNN: ['', Validators.required],
      ZipCode: ['', Validators.required],
      Description: ['', Validators.required],
      Picture: [null, Validators.required],
      Facilities: this.facilities,
    });
    this.storageService.deleteFolderContents('test_images');
  }

  /**
   * Handles the file input event for property picture.
   *
   * @param event - File input event.
   */
  handleFileInput(event: any) {
    this.file = event.target.files[0];
  }

  /**
   * Handles the change event for facilities checkboxes.
   *
   * @param e - Checkbox change event.
   */
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

  /**
   * Opens the "add new condo" dialog.
   */
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

  /**
   * Opens the "add new locker" dialog.
   */
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

  /**
   * Opens the "add new parking" dialog.
   */
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

  /**
   * Deletes a condo item from the list.
   *
   * @param item - Condo item to be deleted.
   */
  deleteCondoItems(item: any) {
    // Delete the item from the deliveryItems array
    this.CondoItems.splice(this.CondoItems.indexOf(item), 1);
    console.log('Item deleted:', item);
    console.log(this.CondoItems);
  }

  /**
   * Deletes a locker item from the list.
   *
   * @param item - Locker item to be deleted.
   */
  deleteLockerItems(item: any) {
    // Delete the item from the deliveryItems array
    this.LockerItems.splice(this.LockerItems.indexOf(item), 1);
    console.log('Item deleted:', item);
    console.log(this.LockerItems);
  }

  /**
   * Deletes a parking item from the list.
   *
   * @param item - Parking item to be deleted.
   */
  deleteParkingItems(item: any) {
    // Delete the item from the deliveryItems array
    this.ParkingItems.splice(this.ParkingItems.indexOf(item), 1);
    console.log('Item deleted:', item);
    console.log(this.ParkingItems);
  }

  /**
   * Handles the form submission.
   * Validates the form, facilities, and item lists before saving the property.
   */
  async onSubmit() {

    this.Propertyform.markAllAsTouched();
    if (this.Propertyform.invalid) {
      this.NotificationService.sendAlert('Please fill out all required fields');

      return;
    }
    if (this.facilities.value.length == 0) {
      this.NotificationService.sendAlert('Please select at least one facility');
      return;
    }
    if (
      this.CondoItems.length == 0 ||
      this.LockerItems.length == 0 ||
      this.ParkingItems.length == 0
    ) {
      this.NotificationService.sendAlert(
        'Please add at least one of each:\n Condo, Locker, Parking Spot'
      );
      return;
    }

    this.loading = true;
    const db = getDatabase();

    let condos: Condo[] = [];
    let lockers: Locker[] = [];
    let parkings: ParkingSpot[] = [];
    let k = 0;

    if (this.CondoItems.length !== 0) {
      const promiseCondos = this.CondoItems.map(async (condoItem) => {
        let imagelink = await this.storageService.uploadToFirestore(
          condoItem.Picture,
          'building_images/' +
            (await this.storageService.IDgenerator('buildings/', db))
        );

        for (let i = 0; i < condoItem.Quantity; i++) {
          condos.push({
            ID: '',
            Type: condoItem.Type,
            OccupantID: '',
            UnitNumber: condoItem.UnitNumber + '-' + k + '-' + i,
            Fee: condoItem.Fee,
            Picture: imagelink,
            Description: condoItem.Description,
            NumberOfBedrooms: condoItem.NumberOfBedrooms,
            NumberOfBathrooms: condoItem.NumberOfBathrooms,
            Status: CondoStatus.Vacant,
            SquareFootage: condoItem.SquareFootage,
          });
        }
        k++;
      });
      await Promise.all(promiseCondos);
    }

    if (this.LockerItems.length !== 0) {
      this.facilities.push(new FormControl(Facilities.Locker));

      this.LockerItems.forEach((lockerItem) => {
        for (let i = 0; i < lockerItem.Quantity; i++) {
          lockers.push({
            ID: '',
            OccupantID: '',
            Number: lockerItem.Number + '-' + k + '-' + i,
            Status: ParkingLockerStatus.Available,
            Height: lockerItem.Height,
            Width: lockerItem.Width,
            Length: lockerItem.Length,
            Fee: lockerItem.Fee,
          });
        }
        k++;
      });
    }

    if (this.ParkingItems.length !== 0) {
      this.facilities.push(new FormControl(Facilities.Parking));
      this.ParkingItems.forEach((parkingItem) => {
        for (let i = 0; i < parkingItem.Quantity; i++) {
          parkings.push({
            ID: '',
            OccupantID: '',
            Number: parkingItem.Number + '-' + k + '-' + i,
            Status: ParkingLockerStatus.Available,
            ParkingType: parkingItem.ParkingType,
            Fee: parkingItem.Fee,
          });
        }
        k++;
      });
    }

    const building: Building = {
      ID: '',
      Year: this.Propertyform.value.Year,
      CompanyID: '',
      Name: this.Propertyform.value.Name,
      Address: `${this.Propertyform.value.StreetNN}, ${this.Propertyform.value.City}, ${this.Propertyform.value.State}, ${this.Propertyform.value.Country}, ${this.Propertyform.value.ZipCode}`,
      Bookings: [],
      Description: this.Propertyform.value.Description,
      Parkings: parkings,
      Lockers: lockers,
      Condos: condos,
      Picture: await this.storageService.uploadToFirestore(
        this.file,
        'building_images/' +
          (await this.storageService.IDgenerator('buildings/', db))
      ),
      Facilities: this.Propertyform.value.Facilities,
    };

    await this.BuildingService.addBuilding(building);

    this.NotificationService.sendNotification('Property Added');
    setTimeout(() => {
      this.reloadPage();
    }, 3000);
  }

  reloadPage() {
    window.location.reload();
  }
}
