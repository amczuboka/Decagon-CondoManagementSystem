import { TestBed } from '@angular/core/testing';

import { ScheduleService } from './schedule.service';
import { AppModule } from '../app.module';

describe('ScheduleService', () => {
  let service: ScheduleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      providers: [ScheduleService],
    });
    service = TestBed.inject(ScheduleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
