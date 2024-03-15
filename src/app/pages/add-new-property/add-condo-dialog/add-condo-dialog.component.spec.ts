import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCondoDialogComponent } from './add-condo-dialog.component';
import { AppModule } from 'src/app/app.module';
import { ReactiveFormsModule, } from '@angular/forms';
import { NotificationService } from 'src/app/services/notification.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('AddCondoDialogComponent', () => {
  let component: AddCondoDialogComponent;
  let fixture: ComponentFixture<AddCondoDialogComponent>;
  let notificationService: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddCondoDialogComponent],
      imports: [AppModule, ReactiveFormsModule],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: NotificationService },
      ],
    });
    fixture = TestBed.createComponent(AddCondoDialogComponent);
    component = fixture.componentInstance;
    notificationService = TestBed.inject(NotificationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle file input', () => {
    const mockFile = new File([''], 'filename', { type: 'image/png' });
    const mockEvent = { target: { files: [mockFile] } };

    component.handleFileInput(mockEvent);

    expect(component.file).toEqual(mockFile);
  });

  it('should initialize the newCondo form', () => {
    // Arrange
    const expectedFormValues = {
      SquareFootage: '',
      NumberOfBedrooms: '',
      NumberOfBathrooms: '',
      Type: '',
      Fee: '',
      Quantity: '',
      Picture: null,
      PictureScr: '',
      Description: '',
      UnitNumber: '',
    };

    // Act
    component.ngOnInit();

    // Assert
    expect(component.newCondo.value).toEqual(expectedFormValues);
  });

  it('should save item and close dialog if form is valid', () => {
    // Arrange
    const mockValue = {
      SquareFootage: 1000,
      NumberOfBedrooms: 2,
      NumberOfBathrooms: 2,
      Type: 'Rent',
      Fee: 500,
      Quantity: 1,
      Picture: '',
      PictureScr: '',
      Description: 'Lorem ipsum',
      UnitNumber: '101',
    };
    component.newCondo.setValue(mockValue);
    const mockFile = new File([''], 'filename', { type: 'image/png' });
    const mockEvent = { target: { files: [mockFile] } };
    component.file = mockFile;

    component.handleFileInput(mockEvent);
   
    component.newCondo.controls['Picture'].setErrors(null);
    component.newCondo.controls['PictureScr'].setErrors(null);
     spyOn(component, 'onCloseClick').and.returnValue();
    // Act
    component.saveItem();
    expect(component.onCloseClick).toHaveBeenCalled();
   

    // Assert

  });

  it('should display notification if form is invalid', () => {
    // Arrange
    const mockValue = {
      SquareFootage: '',
      NumberOfBedrooms: '',
      NumberOfBathrooms: '',
      Type: '',
      Fee: '',
      Quantity: '',
      Picture: null,
      PictureScr: '',
      Description: '',
      UnitNumber: '',
    };
    component.newCondo.setValue(mockValue);
    spyOn(component.notification, 'sendNotification');

    // Act
    component.saveItem();

    // Assert
    expect(component.notification.sendNotification).toHaveBeenCalledWith(
      'Make sure to fill all the fields!'
    );
  });
});
