import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  Authority,
  CompanyDTO,
  EmployeeDTO,
  User,
  UserDTO,
} from './../../models/users';
import { Component } from '@angular/core';
import {
  AuthService,
  MyErrorStateMatcher,
} from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { NotificationService } from 'src/app/services/notification.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent {
  //for the error message in the form
  matcher = new MyErrorStateMatcher();

  profileForm!: FormGroup;
  initialFormValue!: string;
  formUnsaved: boolean = false;

  public file!: any;
  profilePictureLink: string = '';
  Uploading: boolean = false;
  myUser!: any;
  isPublicUser: boolean = false;
  isCompanyUser: boolean = false;
  isEmployeeUser: boolean = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private notificationService: NotificationService,
    private storageService: StorageService,
    private formBuilder: FormBuilder
  ) {
    this.profileForm = this.formBuilder.group({
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      PhoneNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^\\+?1?[-. ]?\\(?([2-9][0-8][0-9])\\)?[-. ]?([2-9][0-9]{2})[-. ]?([0-9]{4})$'
          ),
        ],
      ],
      ProfilePicture: [null],
      UserName: ['', Validators.required],
    });
  }

  async ngOnInit() {
    this.Uploading = true;
    await this.getUserData();

    if (this.myUser) {
      this.profileForm.patchValue({
        FirstName: this.myUser.FirstName,
        LastName: this.myUser.LastName,
        PhoneNumber: this.myUser.PhoneNumber,
        UserName: this.myUser.UserName,
      });

      this.initialFormValue = JSON.stringify(this.profileForm.value);

      this.profileForm.valueChanges.subscribe(() => {
        this.formUnsaved =
          JSON.stringify(this.profileForm.value) !== this.initialFormValue;
      });
    }
    this.Uploading = false;
  }

  async getUserData() {
    this.myUser = this.authService.getUser() as User;
    if (this.myUser) {
      if (this.myUser.photoURL == Authority.Company) {
        this.myUser = await this.userService.getCompanyUser(this.myUser.uid);
        this.isCompanyUser = true;
      } else if (this.myUser.photoURL == Authority.Employee) {
        this.myUser = await this.userService.getPublicUser(this.myUser.uid);
        this.isEmployeeUser = true;
      } else {
        this.myUser = await this.userService.getPublicUser(this.myUser.uid);
        this.isPublicUser = true;
      }
      this.profileForm.patchValue({
        FirstName: this.myUser.FirstName,
        LastName: this.myUser.LastName,
        PhoneNumber: this.myUser.PhoneNumber,
        UserName: this.myUser.UserName,
      });
      this.initialFormValue = JSON.stringify(this.profileForm.value);
    }
  }

  handleFileInput(event: any) {
    this.file = event.target.files[0];
  }

  async onSubmit() {
    if (this.profileForm.invalid) {
      this.notificationService.sendAlert('Please fill out all required fields');
      return;
    }

    this.Uploading = true;

    if (this.file) {
      if (
        this.myUser.ProfilePicture != '' &&
        this.myUser.ProfilePicture != null
      ) {
        console.log('deleting old profile picture');
        // Delete old profile picture
        await this.storageService.deleteFile(this.myUser.ProfilePicture);
      }

      let result = await this.storageService.uploadToFirestore(
        this.file,
        'profile_picture/' + this.myUser.ID
      );
      let myValues = result.split(',');
      let myDownloadLink = myValues[0];
      this.profilePictureLink = myDownloadLink;
    }

    let user = this.formatUser(this.profileForm.value);
    // Only update the ProfilePicture property if a file is selected
    if (this.profilePictureLink) {
      user.ProfilePicture = this.profilePictureLink;
    }

    await this.onEditUser(this.myUser.ID, user);
    await this.getUserData();

    // Reset the ProfilePicture property and the file input field
    this.file = null;
    this.profilePictureLink = '';
    const profilePictureControl = this.profileForm.get('ProfilePicture');
    if (profilePictureControl) {
      profilePictureControl.reset();
    }

    this.userService.updateCurrentUser(this.myUser);

    this.Uploading = false;
    this.notificationService.sendNotification('Profile Updated');
    this.formUnsaved = false;
  }

  async onEditUser(index: any, user: any) {
    await this.userService.editUser(index, user);
  }

  formatUser(value: any) {
    let user: any;
    if (this.isPublicUser) {
      user = {
        FirstName: value.FirstName,
        LastName: value.LastName,
        ID: this.myUser.ID,
        Authority: Authority.Public,
        Email: this.myUser.Email,
        ProfilePicture: value.ProfilePicture || this.myUser.ProfilePicture,
        PhoneNumber: value.PhoneNumber,
        UserName: value.UserName,
      };
    } else if (this.isCompanyUser) {
      user = {
        FirstName: value.FirstName,
        LastName: value.LastName,
        ID: this.myUser.ID,
        Authority: Authority.Company,
        Email: this.myUser.Email,
        ProfilePicture: value.ProfilePicture || this.myUser.ProfilePicture,
        PhoneNumber: value.PhoneNumber,
        CompanyName: this.myUser.CompanyName,
        PropertyIds: this.myUser.PropertyIds,
        EmployeeIds: this.myUser.EmployeeIds,
        UserName: value.UserName,
      };
    } else {
      user = {
        FirstName: value.FirstName,
        LastName: value.LastName,
        ID: this.myUser.ID,
        Authority: Authority.Employee,
        Email: this.myUser.Email,
        ProfilePicture: value.ProfilePicture || this.myUser.ProfilePicture,
        PhoneNumber: value.PhoneNumber,
        CompanyName: this.myUser.CompanyName,
        PropertyIds: this.myUser.PropertyIds,
        UserName: value.UserName,
      };
    }
    return user;
  }
}
