import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MyErrorStateMatcher } from 'src/app/services/auth.service';
import { AuthService } from '../../services/auth.service';

export function phoneNumberValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;

    if (!value) {
      return null; // No validation error if the input is empty
    }

    // Use a regular expression to match the phone number pattern
    const pattern = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
    const isPhoneNumberValid = pattern.test(value);

    return isPhoneNumberValid ? null : { invalidPhoneNumber: true };
  };
}

export function isValidEmail(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const email = control.value;

    if (!email) {
      return null; // No validation error if the input is empty
    }

    // Regular expression pattern for email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email) ? null : { invalidEmail: true };
  };
}

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent {
  paymentForm!: FormGroup;
  matcher = new MyErrorStateMatcher();

  constructor(
    public authService: AuthService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.paymentForm = this.formBuilder.group({
      //Email: ['', [Validators.required, Validators.email]],
      CardNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(16),
          Validators.pattern(/^[0-9]*$/),
        ],
      ],
      ExpiryDate: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.pattern(/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])$/),
        ],
      ],
      CVV: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(/^[0-9]{1,3}$/),
        ],
      ],
      Name: ['', [Validators.required, Validators.minLength(1)]],
      Phone: ['', [Validators.required, phoneNumberValidator()]],
      Email: ['', [Validators.required, isValidEmail()]],
      Amount: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.pattern(/^[0-9]*$/),
        ],
      ],
      Cardholder: ['', [Validators.required, Validators.minLength(1)]],
    });
  }
}
