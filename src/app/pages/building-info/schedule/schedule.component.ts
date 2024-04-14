import { Component, Input } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { Booking, Building } from 'src/app/models/properties';
import { colors } from 'src/app/services/schedule.service';
import { isSameDay, isSameMonth } from 'date-fns';
import { BuildingService } from 'src/app/services/building.service';

/**
 * Component for displaying a schedule/calendar of bookings for a building.
 */
@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent {
  /** The date currently displayed in the calendar. */
  viewDate: Date = new Date();
  /** The current view of the calendar (week, month, etc.). */
  view: CalendarView = CalendarView.Week;
  /** Enum reference to CalendarView. */
  CalendarView = CalendarView;
  /** Array of calendar events representing bookings. */
  events: CalendarEvent[] = [];
  /** Flag indicating if the current day is open (expanded) in the calendar. */
  activeDayIsOpen = false;
  /** The starting hour for each day in the calendar. */
  dayStartHour = 9;
  /** The ending hour for each day in the calendar. */
  dayEndHour = 17;
  /** The building for which the schedule is displayed. */
  @Input() building!: Building;

  /**
   * Constructor for ScheduleComponent.
   * @param buildingService The building service for managing building-related operations.
   */
  constructor(private buildingService: BuildingService) {}

  /**
   * Lifecycle hook that is called after Angular has initialized all data-bound properties of the component.
   */
  async ngOnInit() {
    // Subscribe to real-time updates of the building's bookings
    this.buildingService.subscribeToBuildingById(this.building.ID).subscribe({
      next: (updatedBuilding: any) => {
        if (updatedBuilding) {
          this.setEvents(updatedBuilding.Bookings);
        }
      },
    });
  }

  /**
   * Sets the view of the calendar.
   * @param view The new view to set.
   */
  setView(view: CalendarView) {
    this.view = view;
  }

  /**
   * Sets the events (bookings) to be displayed on the calendar.
   * @param bookings The array of bookings to set as events.
   */
  setEvents(bookings: Booking[]) {
    this.events = [];
    bookings.forEach((booking) => {
      this.events.push({
        start: new Date(booking.Date),
        end: new Date(booking.Date + 3600000), // Adding 1 hour for the end time
        title: booking.Facility,
        color: { ...colors[booking.Facility.replace(/\s/g, '')] },
      });
    });
  }

  /**
   * Handles the click event on a day in the calendar.
   * @param date The date that was clicked.
   * @param events The events associated with the clicked date.
   */
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
;
