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
    private notificationService: NotificationService,
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

  // Sign in with email/password
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
        // console.error(error);
        if (error.code == 'auth/invalid-credential') {
          this.notificationService.sendAlert('Error: Invalid credentials');
        }
        // Handle error here, e.g. show error message to user
      });
  }

  getUser() {
    return JSON.parse(localStorage.getItem('user')!);
  }

  // Sign up with email/password
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

  // Send email verfificaiton when new user sign up
  async SendVerificationMail() {
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.router.navigate(['verify-email']);
        this.notificationService.sendNotification('Email verification sent');
      });
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null;
  }

  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
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

  // Sign out
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
