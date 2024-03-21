import { Component } from '@angular/core';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent {
  // This is a mock code for the schedule component
  today = new Date();
  tomorrow = new Date();
  dayAfterTomorrow = new Date();

  ngOnInit(): void {
    // Set the time for today at 10 AM
    this.today.setHours(10, 0, 0, 0);

    // Set the time for tomorrow at 12 PM
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    this.tomorrow.setHours(12, 0, 0, 0);

    // Set the time for the day after tomorrow at 4 PM
    this.dayAfterTomorrow.setDate(this.dayAfterTomorrow.getDate() + 2);
    this.dayAfterTomorrow.setHours(16, 0, 0, 0);

    console.log(this.today.valueOf());
  }
}
