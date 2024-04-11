import { Component, Input } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { Booking, Building } from 'src/app/models/properties';
import { colors } from 'src/app/services/schedule.service';
import { isSameDay, isSameMonth } from 'date-fns';
import { BuildingService } from 'src/app/services/building.service';


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
  @Input() building!: Building;

  constructor(private buildingService: BuildingService) {
  }

  async ngOnInit() {
    // Subscribe to the building with the building.ID for real time updates
    this.buildingService.subscribeToBuildingById(this.building.ID).subscribe({
      next: (updatedBuilding: any) => {
        if (updatedBuilding) {
          this.setEvents(updatedBuilding.Bookings);
        }
      },
    });
  }

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


