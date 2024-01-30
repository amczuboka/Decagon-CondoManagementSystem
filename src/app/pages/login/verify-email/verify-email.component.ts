import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss'],
})
export class VerifyEmailComponent {
  constructor(public authService: AuthService, private router: Router) {}
  ngOnInit() {
    // if (
    //   this.authService.userData === null ||
    //   this.authService.userData === undefined
    // ) {
    //   this.router.navigate(['/login']);
    // }
  }

  navigateToLogin() {
    window.location.assign('/login');
  }
}
