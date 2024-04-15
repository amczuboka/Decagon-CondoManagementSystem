
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScheduleComponent } from './schedule.component';
import { AppModule } from 'src/app/app.module';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { Booking, Facilities } from 'src/app/models/properties';

describe('ScheduleComponent', () => {
  let component: ScheduleComponent;
  let fixture: ComponentFixture<ScheduleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [ScheduleComponent],
    });
    fixture = TestBed.createComponent(ScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the view', () => {
    const view = CalendarView.Week;
    component.setView(view);
    expect(component.view).toEqual(view);
  });

  it('should set the events', () => {
    const bookings: Booking[] = [
      {
        ID: '',
        OccupantID: '',
        Date: new Date().getTime(),
        Facility: Facilities.MeetingRoom,
      },
      {
        ID: '',
        OccupantID: '',
        Date: new Date().getTime(),
        Facility: Facilities.Gym,
      },
    ];
    component.setEvents(bookings);
    expect(component.events.length).toEqual(bookings.length);
  });

  it('should handle day click', () => {
    const date = new Date();
    const events: CalendarEvent[] = [];
    component.viewDate = new Date();
    component.activeDayIsOpen = true;
    component.dayClicked({ date, events });
    expect(component.activeDayIsOpen).toBe(false);

    component.viewDate = new Date(2022, 1, 1);
    component.dayClicked({ date, events });
    expect(component.activeDayIsOpen).toBe(false);
  });
});