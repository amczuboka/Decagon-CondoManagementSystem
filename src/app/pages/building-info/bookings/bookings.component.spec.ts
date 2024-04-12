import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from 'src/app/app.module';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule} from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';

import { BookingsComponent } from './bookings.component';
import { Facilities } from 'src/app/models/properties';

fdescribe('BookingsComponent', () => {
  let component: BookingsComponent;
  let fixture: ComponentFixture<BookingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
        MatDividerModule, 
        MatRadioModule, 
        MatCardModule, 
        MatIconModule,
        MatDatepickerModule,
        MatNativeDateModule ,
        MatButtonModule,
        MatChipsModule
      ],
      declarations: [BookingsComponent]
    });
    fixture = TestBed.createComponent(BookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize booking form', () => {
      component.ngOnInit();
      expect(component.bookFacilityForm.get('date')).toBeDefined();
      expect(component.bookFacilityForm.get('facility')).toBeDefined();
      expect(component.bookFacilityForm.get('time-slot')).toBeDefined();
      expect(component.bookFacilityForm.get('myUserID')).toBeDefined();
    });
    
  });

  describe('bookableFacilities', () => {
    it('should filter out non-bookable facilities', () => {
        const facilities: Facilities[] = [
            Facilities.Gym,
            Facilities.Locker,
            Facilities.Parking,
            Facilities.Playground,
            Facilities.Spa,   //bookable
            Facilities.MeetingRoom, //bookable
            Facilities.Pool, //bookable
        ];

        const bookable = component.bookableFacilities(facilities);
        
        // Verify that non-bookable facilities are excluded
        expect(bookable).not.toContain(Facilities.Gym);
        expect(bookable).not.toContain(Facilities.Locker);
        expect(bookable).not.toContain(Facilities.Parking);
        expect(bookable).not.toContain(Facilities.Playground);

        // Verify that bookable facilities are included
        expect(bookable).toContain(Facilities.Spa);
        expect(bookable).toContain(Facilities.MeetingRoom);
        expect(bookable).toContain(Facilities.Pool);
    });
});

  


});
