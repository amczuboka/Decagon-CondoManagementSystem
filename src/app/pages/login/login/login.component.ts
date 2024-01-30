import { Component } from '@angular/core';
import { AuthService, MyErrorStateMatcher } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

  loginForm!: FormGroup;
  
  //for the error message in the form
  matcher = new MyErrorStateMatcher();

  //for the icons in password field
  hide = true;

  constructor(
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async onSubmit() {
    // stop the process here if form is invalid
    if (this.loginForm.invalid) {
      this.storageService.sendNotification(
        'make sure to answer all required fields'
      );

      return;
    }

    await this.authService.SignIn(
      this.loginForm.value.Email,
      this.loginForm.value.Password
    );
    window.open('', '_self');
  }
}
