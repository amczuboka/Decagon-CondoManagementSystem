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
  ngOnInit() {}

  async resendVerificationEmail() {
    await this.authService.SendVerificationMail();
  }

  navigateToLogin() {
    if (this.authService.getUser()) {
      this.authService.SignOut();
    }
  }
}
