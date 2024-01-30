import { Injectable } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any; // Save logged in user data

  constructor() {}

  // Sign in with email/password
  async SignIn(email: string, password: string) {
    // return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    // return this.afAuth.currentUser
    //   .then((u: any) => u.sendEmailVerification())
    //   .then(() => {
    //     this.router.navigate(['verify-email']);
    //   });
  }
}
