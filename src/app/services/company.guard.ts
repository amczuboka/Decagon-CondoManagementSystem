import { Injectable } from '@angular/core';
import { CanActivate, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CompanyGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Determines if a route can be activated based on the user's authority level.
   *
   * @returns An Observable, Promise, or immediate boolean value or UrlTree. Returns true if the user is a company, otherwise navigates to the root route and returns false.
   */
  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const user = this.authService.getUser();
    if (user && user.photoURL === 'Company') {
      return true;
    } else {
      this.router.navigate(['']);
      return false;
    }
  }
}
