import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from './notification.service';
import { AppModule } from '../app.module';

describe('NotificationService', () => {
  let service: NotificationService;
  let snackBar: MatSnackBar;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      providers: [NotificationService, MatSnackBar],
    });
    service = TestBed.inject(NotificationService);
    snackBar = TestBed.inject(MatSnackBar);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should display a notification using the MatSnackBar', () => {
    const openSpy = spyOn(snackBar, 'open');
    const text = 'Notification text';

    service.sendNotification(text);

    expect(openSpy).toHaveBeenCalledWith(text, '', {
      duration: 3000,
      horizontalPosition: service.horizontalPosition,
      verticalPosition: service.verticalPosition,
      panelClass: ['kawaiicolors-snackbar'],
    });
  });

  it('should display an alert using the MatSnackBar', () => {
    const openSpy = spyOn(snackBar, 'open');
    const text = 'Alert text';

    service.sendAlert(text);

    expect(openSpy).toHaveBeenCalledWith(text, '', {
      duration: 3000,
      horizontalPosition: service.horizontalPosition,
      verticalPosition: service.verticalPosition,
      panelClass: ['alert-snackbar'],
    });
  });

  it('should set the horizontal and vertical positions', () => {
    const horizontalPosition = 'left';
    const verticalPosition = 'bottom';

    service.horizontalPosition = horizontalPosition;
    service.verticalPosition = verticalPosition;

    expect(service.horizontalPosition).toEqual(horizontalPosition);
    expect(service.verticalPosition).toEqual(verticalPosition);
  });
});
