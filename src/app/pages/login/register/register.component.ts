import { Authority } from './../../../models/users';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AuthService,
  MyErrorStateMatcher,
} from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm!: FormGroup;
  matcher = new MyErrorStateMatcher();
  hide = true;
  Uploading = false;

  constructor(
    public authService: AuthService,
    private formBuilder: FormBuilder,
    public notificationService: NotificationService,
    public userService: UserService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      Email: ['', [Validators.required, Validators.email]],
      ConfirmEmail: ['', [Validators.required, Validators.email]],
      FirstName: ['', [Validators.required]],
      LastName: ['', [Validators.required]],
      Password: ['', [Validators.required, Validators.minLength(6)]],
      ConfirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      Authority: [Authority.Public, [Validators.required]],
      CompanyName: [''],
      ID: [''],
    });

    // Subscribe to Authority field changes
    this.registerForm.get('Authority')!.valueChanges.subscribe((value) => {
      // Trigger validation for CompanyName
      this.registerForm.get('CompanyName')!.updateValueAndValidity();

      // If the selected authority is not 'Company', clear the validation error for CompanyName
      if (value !== Authority.Company || value !== Authority.Employee) {
        this.registerForm.get('CompanyName')!.setErrors(null);
      }
    });
  }

  passwordConfirmationValidator(form: FormGroup) {
    const password = form.get('Password')!.value;
    const confirm = form.get('ConfirmPassword')!.value;

    if (password !== confirm) {
      form.controls['ConfirmPassword'].setErrors({ incorrect: true });
    } else {
      form.controls['ConfirmPassword'].setErrors(null);
    }
    return password === confirm ? null : 'The passwords are not the same';
  }

  emailConfirmationValidator(form: FormGroup) {
    const email = form.get('Email')!.value;
    const confirm = form.get('ConfirmEmail')!.value;

    if (email !== confirm) {
      form.controls['ConfirmEmail'].setErrors({ incorrect: true });
    } else {
      form.controls['ConfirmEmail'].setErrors(null);
    }
    return email === confirm ? null : 'The emails are not the same';
  }

  async onSubmit() {
    // stop the process here if form is invalid
    if (this.registerForm.invalid) {
      this.notificationService.sendAlert(
        'Make sure to answer all required fields'
      );
      return;
    }
    this.Uploading = true;
    let authority = this.registerForm.value.Authority;
    let path = '';
    if (authority == Authority.Public) {
      path = 'public users/';
    } else if (authority == Authority.Company) {
      path = 'companies/';
      const companyName = this.registerForm.value.CompanyName;
      const existingCompany = await this.userService.checkIfCompanyExists(
        companyName
      );
      if (existingCompany) {
        this.notificationService.sendAlert(
          `Company account for ${companyName} already exists`
        );
        this.Uploading = false;
        return;
      }
    } else if (authority == Authority.Employee) {
      path = 'employees/';
      const companyName = this.registerForm.value.CompanyName;
      const existingCompany = await this.userService.checkIfCompanyExists(
        companyName
      );
      if (!existingCompany) {
        this.notificationService.sendAlert(
          `Company account for ${companyName} does not exist`
        );
        this.Uploading = false;
        return;
      }
    }
    let rid: string = '';
    rid = await this.authService.SignUp(
      this.registerForm.value.Email,
      this.registerForm.value.Password,
      authority
    );
    if (rid == '') {
      this.Uploading = false;
      return;
    }
    await this.userService.registerUser(this.registerForm.value, rid, path);
    this.Uploading = false;
  }

}
