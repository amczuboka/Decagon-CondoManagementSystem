import {
  Authority,
  CompanyDTO,
  EmployeeDTO,
  UserDTO,
} from './../../../models/users';
import { Component } from '@angular/core';
import {
  AuthService,
  MyErrorStateMatcher,
} from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm!: FormGroup;
  loading: boolean = false;

  //for the error message in the form
  matcher = new MyErrorStateMatcher();

  //for the icons in password field
  hide = true;

  constructor(
    public authService: AuthService,
    private formBuilder: FormBuilder,
    public notificationService: NotificationService,
    public userService: UserService,
    public router: Router
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
      this.notificationService.sendAlert(
        'Make sure to answer all required fields'
      );
      return;
    }

    this.loading = true;
    await this.authService.SignIn(
      this.loginForm.value.Email,
      this.loginForm.value.Password
    );
    let myUser = this.authService.getUser();
    if (myUser) {
      if (myUser.photoURL == Authority.Company) {
        myUser = (await this.userService.getCompanyUser(
          myUser.uid
        )) as CompanyDTO;
      } else if (myUser.photoURL == Authority.Employee) {
        myUser = (await this.userService.getEmployeeUser(
          myUser.uid
        )) as EmployeeDTO;
      } else {
        myUser = (await this.userService.getPublicUser(myUser.uid)) as UserDTO;
      }
      if (!myUser) {
        this.authService.SignOut();
        this.userService.updateUser(null);
        this.notificationService.sendAlert(
          'User not found or account disabled'
        );
      } else {
        this.userService.updateUser(myUser);
        this.router.navigate(['']);
      }
    }
    this.loading = false;
  }
}
