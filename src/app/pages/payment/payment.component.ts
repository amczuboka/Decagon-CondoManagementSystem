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
import { Condo } from 'src/app/models/properties';
import { ActivatedRoute, Router } from '@angular/router';
import { BuildingService } from 'src/app/services/building.service';
import { NotificationService } from './../../services/notification.service';

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
  condo!: Condo;
  fee!: number;
  parkingFee!: number;
  amount: number = 0;
  buildingID!: string;
  balance!: number;
  myUser!: any;

  constructor(
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private buildingService: BuildingService,
    private NotificationService: NotificationService
  ) {}

  async ngOnInit() {
    this.route.queryParams.subscribe((params: any) => {
      const condoProps: any = params['condo'];
      const parsedCondoProps: any = JSON.parse(condoProps);
      this.condo = parsedCondoProps as Condo;
      this.buildingID = params['buildingID'] as string;
    });

    this.myUser = await this.authService.getUser();

    await this.buildingService
      .getUserParkings(this.buildingID, this.myUser.uid)
      .then((userParkings) => {
        if (userParkings.length > 0) {
          this.parkingFee = userParkings.length * 2;
          console.log("yes")
        } else {
          this.parkingFee = 0;
          console.log("no")
        }
      });

    this.buildingService
      .subscribeToCondoById(this.buildingID, this.condo.ID)
      .subscribe({
        next: (condo: Condo | null) => {
          if (condo) {
            this.condo = condo;
            if (this.condo.CondoFee || this.condo.CondoFee === 0) {
                // Round the fee to 2 digits after the decimal point
              this.fee = parseFloat(this.condo.CondoFee.toFixed(2));
            } else {
              this.fee = parseFloat(((this.condo.SquareFootage * 0.35) + this.parkingFee).toFixed(2));

              this.buildingService.updateCondoFee(
                this.buildingID,
                this.condo,
                this.fee
              );
            }
            this.balance = parseFloat(this.fee.toFixed(2));
          }
        },
      });

    this.paymentForm = this.formBuilder.group({
      CardNumber: [
      '',
      [
        Validators.required,
        Validators.minLength(16),
        Validators.maxLength(16),
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
        Validators.pattern(/^\d+(\.\d{1,2})?$/),
        maxFeeValidator(() => this.fee),
      ],
      ],
      Cardholder: ['', [Validators.required, Validators.minLength(1)]],
    });
  }

  ngAfterViewInit() {
    this.paymentForm.valueChanges.subscribe((formValue) => {
      this.amount = (formValue.Amount as number) || 0;
      this.balance = parseFloat((this.fee - this.amount).toFixed(2));
    });
  }

  submitPayment() {
    this.paymentForm.markAllAsTouched();
    if (this.paymentForm.invalid) {
      this.NotificationService.sendAlert('Please fill out all required fields');

      return;
    }
    if (this.paymentForm.valid) {
      this.buildingService
        .updateCondoFee(this.buildingID, this.condo, this.balance)
        .then(() => {
          this.NotificationService.sendAlert(
            'Condo Fee balance has been paid!'
          );
          this.router.navigate(['my-properties']);
      });
    }
  }
}

export function maxFeeValidator(maxFee: () => number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value > maxFee()) {
      return { maxFee: true };
    }
    return null;
  };
}
