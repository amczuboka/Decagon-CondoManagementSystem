import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { EditCondoDialogComponent } from './edit-condo-dialog.component';
import { MatInputModule } from '@angular/material/input';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import {
  Condo,
  Building,
  CondoType,
  CondoStatus,
} from 'src/app/models/properties';
import { of } from 'rxjs';
import { firebaseConfig } from '../../../../environments/environment';

describe('EditCondoDialogComponent', () => {
  let component: EditCondoDialogComponent;
  let fixture: ComponentFixture<EditCondoDialogComponent>;
  let mockDialogRef: MatDialogRef<EditCondoDialogComponent>;
  let mockAngularFireStorage: any;

  beforeEach(waitForAsync(() => {
    mockDialogRef = jasmine.createSpyObj(['close']);

    mockAngularFireStorage = {
      ref: jasmine.createSpy().and.returnValue({
        put: jasmine.createSpy().and.returnValue(
          of({
            task: Promise.resolve(),
            ref: { getDownloadURL: () => Promise.resolve('uploaded-file-url') },
          })
        ),
        getDownloadURL: jasmine.createSpy().and.returnValue(of('fake-url')),
      }),
    };

    TestBed.configureTestingModule({
      declarations: [EditCondoDialogComponent],
      imports: [
        FormsModule,
        MatInputModule,
        NoopAnimationsModule,
        BrowserAnimationsModule,
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFireDatabaseModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            condo: {
              ID: '1',
              Type: CondoType.Sale,
              OccupantID: 'occupantID',
              UnitNumber: 'unitNumber',
              Fee: 1000,
              Picture: 'some-picture-url',
              Description: 'condo description',
              NumberOfBedrooms: 2,
              NumberOfBathrooms: 2,
              Status: CondoStatus.Vacant,
              SquareFootage: 1000,
            } as Condo,
            building: {
              ID: '1',
              Year: 2022,
              CompanyID: 'companyID',
              Name: 'Test Building',
              Address: '123 Main St',
              Bookings: [],
              Description: 'building description',
              Parkings: [],
              Lockers: [],
              Condos: [],
              Picture: 'building-picture-url',
              Facilities: [],
            } as Building,
          },
        },
        { provide: AngularFireStorage, useValue: mockAngularFireStorage },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCondoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update condo picture on file selection', () => {
    const file = new File(['sample'], 'sample.jpg', { type: 'image/jpeg' });
    const event = { target: { files: [file] } } as unknown as Event;

    component.onFileSelected(event);
    fixture.detectChanges();

    expect(component.selectedFile).toEqual(file);
    expect(component.selectedFileName).toEqual('sample.jpg');
  });

 it('should handle file input correctly', () => {
   const file = new File(['sample'], 'sample.jpg', { type: 'image/jpeg' });
   const event = { target: { files: [file] } } as unknown as Event;

   component.handleFileInput(event);
   fixture.detectChanges();

   expect(component.selectedFile).toEqual(file);
   expect(component.selectedFileName).toEqual('sample.jpg');
 });

  it('should call updateCondoInDatabase when saving changes without file upload', () => {
    spyOn<any>(component, 'updateCondoInDatabase');

    component.saveChanges();

    expect(component['updateCondoInDatabase']).toHaveBeenCalledWith(
      '1',
      '1',
      component.editCondo
    );
  });

  it('should call updateCondoInDatabase when saving changes with file upload', async () => {
    const file = new File(['sample'], 'sample.jpg', { type: 'image/jpeg' });
    component.selectedFile = file;

    spyOn<any>(component, 'uploadFile').and.returnValue(
      Promise.resolve('sample-url')
    );

    spyOn<any>(component, 'updateCondoInDatabase').and.callThrough(); // Ensure original method is called

    await component.saveChanges();

    expect(component['updateCondoInDatabase']).toHaveBeenCalledWith(
      '1',
      '1',
      jasmine.any(Object) // Make the assertion more flexible
    );
  });

  it('should close dialog on cancel', () => {
    component.onCancel();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });
});
