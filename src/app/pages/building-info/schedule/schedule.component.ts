import { Component } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { Booking, Facilities, TimeSlots } from 'src/app/models/properties';
import { colors } from 'src/app/services/schedule.service';
import { isSameDay, isSameMonth } from 'date-fns';


@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent {
  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Week;
  CalendarView = CalendarView;
  events: CalendarEvent[] = [];
  activeDayIsOpen = false;
  dayStartHour = 9;
  dayEndHour = 17;
  // This is a mock code for the schedule component
  today = new Date();
  tomorrow = new Date();
  dayAfterTomorrow = new Date();
  bookings: Booking[] = [];
  //end of mock code
  constructor() {
    // This is a mock code for the schedule component
    this.today.setHours(10, 0, 0, 0);
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    this.tomorrow.setHours(12, 0, 0, 0);
    this.dayAfterTomorrow.setDate(this.dayAfterTomorrow.getDate() + 2);
    this.dayAfterTomorrow.setHours(16, 0, 0, 0);

    let hour1 = this.today.valueOf();
    let hour2 = this.tomorrow.valueOf();
    let hour3 = this.dayAfterTomorrow.valueOf();

    this.bookings.push(
      {
        ID: '1',
        OccupantID: 'string;',
        Facility: Facilities.Gym,
        Date: hour1,
      },
      {
        ID: '2',
        OccupantID: 'string;',
        Facility: Facilities.MeetingRoom,
        Date: hour2,
      },
      { ID: '3', 
        OccupantID: 
        'string;', 
        Facility: Facilities.Spa, 
        Date: hour3,
      }
    );
    //end of mock code
    this.setEvents(this.bookings);
  }

  ngOnInit(): void {}

  setView(view: CalendarView) {
    this.view = view;
  }

  setEvents(bookings: Booking[]) {
    bookings.forEach((booking) => {
      this.events.push({
        start: new Date(booking.Date),
        end: new Date(booking.Date + 3600000),
        title: booking.Facility,

        color: { ...colors[booking.Facility.replace(/\s/g, '')] },
      });
    });
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }
}
