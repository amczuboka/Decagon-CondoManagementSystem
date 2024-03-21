import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthguardGuard {
  constructor(public authService: AuthService, public router: Router) {}

  /**
   * Determines if a route can be activated based on the user's email verification status.
   *
   * If the user is logged in and their email is verified, it returns true.
   * If the user is logged in but their email is not verified, it navigates to the 'verify-email' route and returns false.
   * If the user is not logged in, it navigates to the 'login' route and returns false.
   *
   * @returns An Observable, Promise, or immediate boolean value.
   */
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    if (user?.emailVerified) {
      return true;
    } else if (user) {
      this.router.navigate(['verify-email']);
      return false;
    } else {
      this.router.navigate(['login']);
      return false;
    }
  }
}
