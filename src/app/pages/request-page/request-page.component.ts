import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Building } from 'src/app/models/properties';
import { Authority, NotificationType } from 'src/app/models/users';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-request-page',
  templateUrl: './request-page.component.html',
  styleUrls: ['./request-page.component.scss'],
})
export class RequestPageComponent {
  @Input() building!: Building;
  @Input() sourcePage!: string;
  requestForm!: FormGroup;
  //   requestTypes = ['Move In / Move Out', 'Intercome Changes', 'Report Violation / Deficiency', 'Request Access', 'General Questions'];
  requestTypes: string[] = Object.values(NotificationType);

  myUser!: any;
  authority!: string;

  constructor(
    public formBuilder: FormBuilder,
    public route: ActivatedRoute,
    public router: Router,
    public authService: AuthService,
    public userService: UserService,
    public notificationService: NotificationService
  ) {}

  async ngOnInit() {
    this.requestForm = this.formBuilder.group({
      RequestType: ['', Validators.required],
      Comments: [''],
    });

    // Fetch the current user
    try {
      this.myUser = await this.authService.getUser();
      if (this.myUser) {
        this.authority = this.myUser.photoURL;
        if (this.authority == Authority.Public) {
          this.userService.getPublicUser(this.myUser.uid).then((user) => {
            this.myUser = user;
          });
        } else if (this.authority == Authority.Employee) {
          this.userService.getEmployeeUser(this.myUser.uid).then((user) => {
            this.myUser = user;
          });
        } else if (this.authority == Authority.Company) {
          this.userService.getCompanyUser(this.myUser.uid).then((user) => {
            this.myUser = user;
          });
        }
      } else {
        this.authority = '';
      }
    } catch (error) {
      console.error(error);
      this.authority = '';
    }
  }

  async onSubmit() {
    console.warn('Your order has been submitted', this.requestForm.value);
    if (this.requestForm.invalid) {
      console.log('Form is invalid');
      this.notificationService.sendAlert('You must select a request type.');
    } else {
      console.log('Form is valid');
      await this.sendRequest();
      this.requestForm.reset();
      this.notificationService.sendNotification(
        'Your request has been submitted.'
      );
    }
  }

  async sendRequest() {
    // Create a new notification
    const notification: any = {
      Date: new Date().getTime(),
      Message: `${this.requestForm.value.Comments}`,
      New: true,
      SenderId: this.myUser.ID,
      SenderName: `${this.myUser.FirstName} ${this.myUser.LastName}`,
      Type: this.requestForm.value.RequestType as NotificationType,
    };
    await this.userService.sendNotificationToUser(
      this.building.CompanyID,
      Authority.Company,
      notification
    );
  }
}
