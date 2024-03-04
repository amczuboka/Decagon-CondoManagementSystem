import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

/**
 * Service for displaying notifications and alerts using MatSnackBar.
 */
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  /**
   * Horizontal position of the snackbar.
   */
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';

  /**
   * Vertical position of the snackbar.
   */
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  /**
   * Displays a notification using the MatSnackBar.
   *
   * @param text - The text to display in the notification.
   */
  sendNotification(text: string): void {
    this.snackBar.open(text, '', {
      duration: 3000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: ['kawaiicolors-snackbar'],
    });
  }

  /**
   * Displays an alert using the MatSnackBar.
   *
   * @param text - The text to display in the alert.
   */
  async sendAlert(text: string): Promise<void> {
    this.snackBar.open(text, '', {
      duration: 3000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: ['alert-snackbar'],
    });
  }
}
