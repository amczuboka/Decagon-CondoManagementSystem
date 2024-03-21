import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Building, Condo } from 'src/app/models/properties';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-edit-condo-dialog',
  templateUrl: './edit-condo-dialog.component.html',
  styleUrls: ['./edit-condo-dialog.component.scss'],
})
export class EditCondoDialogComponent {
  @Input() condo!: Condo;
  @Input() building!: Building;
  editCondo: Condo; // Define condo to edit

  selectedFile: File | null = null;
  selectedFileName: string = '';

  constructor(
    private storage: AngularFireStorage,
    public dialogRef: MatDialogRef<EditCondoDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { condo: Condo; building: Building },
    private db: AngularFireDatabase
  ) {
    this.editCondo = { ...data.condo };
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      this.selectedFileName = '';
      this.selectedFile = null;
      return;
    }
    this.selectedFile = input.files[0];
    this.selectedFileName = this.selectedFile.name;
  }

  saveChanges(): void {
    if (this.selectedFile) {
      // Simulate file upload process
      this.uploadFile(this.selectedFile)
        .then((imageUrl: string) => {
          // Update condo's picture URL with the new image URL
          this.editCondo.Picture = imageUrl;
          // Update condo in the database
          if (this.data.building && this.data.condo) {
            // Use data object to access building and condo properties
            this.updateCondoInDatabase(
              this.data.building.ID,
              this.data.condo.ID,
              this.editCondo
            );
          }
        })
        .catch((error: any) => {
          console.error('Error uploading file:', error);
          // Handle error, optionally show a message to the user
        });
    } else {
      // Update condo in the database
      if (this.data.building && this.data.condo) {
        // Use data object to access building and condo properties
        this.updateCondoInDatabase(
          this.data.building.ID,
          this.data.condo.ID,
          this.editCondo
        );
      }
    }
  }

  private updateCondoInDatabase(
    buildingID: string,
    condoID: string,
    condo: Condo
  ): void {
    // Access building from the data object
    const building = this.data.building;

    // Find the index of the condo within the Condos array
    const condoIndex = building?.Condos.findIndex((c) => c.ID === condoID);

    // Check if the condo exists
    if (condoIndex === -1) {
      console.error('Condo not found in the building');
      return;
    }

    // Log the existing condo found
    console.log('Existing condo:', building?.Condos[condoIndex]);

    // Update the condo with the new data
    if (building && building.Condos) {
      building.Condos[condoIndex] = {
        ...building.Condos[condoIndex],
        ...condo,
      };
    }

    // Proceed with updating the condo in the database
    const buildingRef = this.db.object(`buildings/${buildingID}`);
    buildingRef
      .update({ Condos: building?.Condos })
      .then(() => {
        // Close the dialog with the updated condo
        this.dialogRef.close(condo);
      })
      .catch((error: any) => {
        console.error('Error updating condo in database:', error);
      });
  }

  onCancel(): void {
    // Close the dialog without saving changes
    this.dialogRef.close();
  }

  handleFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      this.selectedFileName = '';
      this.selectedFile = null;
      return;
    }

    this.selectedFile = input.files[0];
    this.selectedFileName = this.selectedFile.name;

    const reader = new FileReader();
    reader.readAsDataURL(this.selectedFile);

    reader.onload = () => {
      this.editCondo.Picture = reader.result as string;
    };

    reader.onerror = (error) => {
      console.error('Error reading file:', error);
    };
  }

  private uploadFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const filePath = `condo_images/${file.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

      task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe(
              (url: string) => {
                resolve(url); // Return the URL of the uploaded file
              },
              (error) => {
                reject(error); // Handle error if getting download URL fails
              }
            );
          })
        )
        .subscribe();
    });
  }
}
