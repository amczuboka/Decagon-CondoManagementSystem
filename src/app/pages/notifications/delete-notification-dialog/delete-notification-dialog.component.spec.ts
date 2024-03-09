import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DeleteNotificationDialogComponent } from './delete-notification-dialog.component';
import { AppModule } from 'src/app/app.module';

describe('DeleteNotificationDialogComponent', () => {
  let component: DeleteNotificationDialogComponent;
  let fixture: ComponentFixture<DeleteNotificationDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [DeleteNotificationDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    });
    fixture = TestBed.createComponent(DeleteNotificationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog on cancel', () => {
    spyOn(component.dialogRef, 'close');
    component.onCancel();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });
});
