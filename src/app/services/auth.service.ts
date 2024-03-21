import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';
import { User } from '../models/users';

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

  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public notificationService: NotificationService,
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  /**
   * Signs in a user using their email and password.
   *
   * If the user's email is verified, it sets the user's data and navigates to the root route.
   * If the email is not verified, it sends a notification to verify the email.
   * If the sign-in operation fails due to invalid credentials, it sends an alert.
   *
   * @param {string} email - The user's email.
   * @param {string} password - The user's password.
   * @returns A Promise that resolves when the sign-in operation is complete.
   */
  async SignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        if (result.user?.emailVerified) {
          this.SetUserData(result.user);
          this.router.navigate(['']);
        } else {
          this.notificationService.sendNotification(
            'Please verify your email before login'
          );
        }
      })
      .catch((error) => {
        if (error.code == 'auth/invalid-credential') {
          this.notificationService.sendAlert('Error: Invalid credentials');
        }
      });
  }

  /**
   * Retrieves the current user's data from local storage.
   *
   * @returns The user's data as a JSON object, or `null` if no user data is stored.
   */
  getUser() {
    return JSON.parse(localStorage.getItem('user')!);
  }

  /**
   * Signs up a new user using their email, password, and authority level.
   *
   * If the sign-up operation is successful, it sends a verification email, sets the user's data,
   * updates the user's profile with their authority level, and returns the user's ID.
   * If the email is already in use, it sends an alert and returns an empty string.
   *
   * @param {string} email - The user's email.
   * @param {string} password - The user's password.
   * @param {string} authority - The user's authority level.
   * @returns A Promise that resolves to the user's ID as a string, or an empty string if the sign-up operation fails.
   * @throws Will throw an error if the sign-up operation fails for a reason other than the email already being in use.
   */
  async SignUp(email: string, password: string, authority: string) {
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(
        email,
        password
      );

      /* Call the SendVerificaitonMail() function when new user sign 
          up and returns promise */
      await this.SendVerificationMail();
      this.SetUserData(result.user, authority);

      const user = result.user;
      // once we get user object then update user display name using following method
      await user!.updateProfile({ photoURL: authority });
      return user!.uid;
    } catch (error: Error | any) {
      if (error.code == 'auth/email-already-in-use') {
        this.notificationService.sendAlert('Error: Email already in use');
        return '';
      }
    }
    return '';
  }

  /**
   * Sends a verification email to the current user.
   *
   * If the operation is successful, it navigates to the 'verify-email' route and sends a notification that the email verification has been sent.
   *
   * @returns A Promise that resolves when the email verification has been sent and the navigation and notification operations are complete.
   */
  async SendVerificationMail() {
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.router.navigate(['verify-email']);
        this.notificationService.sendNotification('Email verification sent');
      });
  }

  /**
   * Checks if a user is currently logged in.
   *
   * @returns A boolean indicating whether a user is logged in. Returns true if a user is stored in local storage, otherwise false.
   */
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null;
  }

  /**
   * Sets the user's data in both local storage and Firestore.
   *
   * @param {any} user - The user object to set the data for.
   * @param {string} [authority] - The user's authority level. If provided, it will be used as the user's photoURL.
   * @returns A Promise that resolves when the user's data has been set in Firestore.
   */
  SetUserData(user: any, authority?: string) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      photoURL: authority ? authority : user.photoURL,
      emailVerified: user.emailVerified,
    };
    localStorage.setItem('user', JSON.stringify(userData));
    return userRef.set(userData, {
      merge: true,
    });
  }

  /**
   * Signs out the current user.
   *
   * If the sign-out operation is successful, it removes the user's data from local storage and navigates to the 'login' route.
   *
   * @returns A Promise that resolves when the sign-out operation is complete and the user's data has been removed from local storage.
   */
  async SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      // this.chatrommService.setPageNumber({
      //   roomName: '',
      //   pageNumber: 1,
      // } as PageInfo);
      this.router.navigate(['login']);
    });
  }
}
