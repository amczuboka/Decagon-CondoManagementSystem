import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthguardGuard {
  constructor(public authService: AuthService, public router: Router) {}

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
