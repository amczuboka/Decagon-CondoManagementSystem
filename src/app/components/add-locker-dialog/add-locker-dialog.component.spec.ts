import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLockerDialogComponent } from './add-locker-dialog.component';
import { NotificationService } from 'src/app/services/notification.service';
import { AppModule } from 'src/app/app.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('AddLockerDialogComponent', () => {
  let component: AddLockerDialogComponent;
  let fixture: ComponentFixture<AddLockerDialogComponent>;
  let notificationService: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddLockerDialogComponent],
      imports: [AppModule, ReactiveFormsModule],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: NotificationService },
      ],
    });
    fixture = TestBed.createComponent(AddLockerDialogComponent);
    component = fixture.componentInstance;
    notificationService = TestBed.inject(NotificationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the newLocker form', () => {
    // Arrange
    const expectedFormValues = {
      Number: '',
      Height: '',
      HeightUnit: '',
      Width: '',
      WidthUnit: '',
      Length: '',
      LengthUnit: '',
      Fee: '',
      Quantity: '',
    };

    // Act
    component.ngOnInit();

    // Assert
    expect(component.newLocker.value).toEqual(expectedFormValues);
  });

  it('should save item and close dialog if form is valid', () => {
    // Arrange
    const mockValue = {
      Number: 'Locker101',
      Height: '60',
      HeightUnit: 'cm',
      Width: '30',
      WidthUnit: 'cm',
      Length: '45',
      LengthUnit: 'cm',
      Fee: '100',
      Quantity: '1',
    };
    component.newLocker.setValue(mockValue);

    spyOn(component, 'onCloseClick').and.returnValue();

    // Act
    component.saveItem();

    // Assert
    expect(component.onCloseClick).toHaveBeenCalledWith({
      Height: '60cm',
      Width: '30cm',
      Length: '45cm',
      Number: 'Locker101',
      Fee: '100',
      Quantity: '1',
    });
  });

  it('should display notification if form is invalid', () => {
    // Arrange
    const mockValue = {
      Number: '',
      Height: '',
      HeightUnit: '',
      Width: '',
      WidthUnit: '',
      Length: '',
      LengthUnit: '',
      Fee: '',
      Quantity: '',
    };
    component.newLocker.setValue(mockValue);
    spyOn(component.notification, 'sendNotification');

    // Act
    component.saveItem();

    // Assert
    expect(component.notification.sendNotification).toHaveBeenCalledWith(
      'Make sure to fill all the fields!'
    );
  });
});
