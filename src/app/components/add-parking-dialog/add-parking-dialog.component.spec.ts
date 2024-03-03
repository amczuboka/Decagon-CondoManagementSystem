import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddParkingDialogComponent } from './add-parking-dialog.component';
import { NotificationService } from 'src/app/services/notification.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { AppModule } from 'src/app/app.module';

describe('AddParkingDialogComponent', () => {
  let component: AddParkingDialogComponent;
  let fixture: ComponentFixture<AddParkingDialogComponent>;
  let notificationService: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddParkingDialogComponent],
      imports: [AppModule, ReactiveFormsModule],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: NotificationService },
      ],
    });
    fixture = TestBed.createComponent(AddParkingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the newParking form', () => {
    // Arrange
    const expectedFormValues = {
      Number: '',
      ParkingType: '',
      Fee: '',
      Quantity: '',
    };

    // Act
    component.ngOnInit();

    // Assert
    expect(component.newParking.value).toEqual(expectedFormValues);
  });

  it('should save item and close dialog if form is valid', () => {
    // Arrange
    const mockValue = {
      Number: 'P101',
      ParkingType: 'Standard',
      Fee: '50',
      Quantity: '1',
    };
    component.newParking.setValue(mockValue);

    spyOn(component, 'onCloseClick').and.returnValue();

    // Act
    component.saveItem();

    // Assert
    expect(component.onCloseClick).toHaveBeenCalledWith({
      Number: 'P101',
      ParkingType: 'Standard',
      Fee: '50',
      Quantity: '1',
    });
  });

  it('should display notification if form is invalid', () => {
    // Arrange
    const mockValue = {
      Number: '',
      ParkingType: '',
      Fee: '',
      Quantity: '',
    };
    component.newParking.setValue(mockValue);
    spyOn(component.notification, 'sendNotification');

    // Act
    component.saveItem();

    // Assert
    expect(component.notification.sendNotification).toHaveBeenCalledWith(
      'Make sure to fill all the fields!'
    );
  });
});
