import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { UserProfileComponent } from './user-profile.component';
import { AppModule } from 'src/app/app.module';
import { of } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CompanyDTO, EmployeeDTO, UserDTO } from 'src/app/models/users';

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [UserProfileComponent],
    });
    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    authService = TestBed.inject(AuthService);
    component.profileForm.patchValue({
      FirstName: '',
      LastName: '',
      PhoneNumber: '',
      UserName: '',
    });
  });

  afterEach(async () => {
    await authService.SignOut();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with user data', async () => {
    await authService.SignIn('dojefe6817@giratex.com', '123456');

    await component.ngOnInit();

    expect(component.profileForm.value.FirstName).toEqual(
      component.myUser.FirstName
    );
    expect(component.profileForm.value.LastName).toEqual(
      component.myUser.LastName
    );
    expect(component.profileForm.value.PhoneNumber).toEqual(
      component.myUser.PhoneNumber
    );
    expect(component.profileForm.value.UserName).toEqual(
      component.myUser.UserName
    );
  });

  it('should retrieve user data on initialization', async () => {
    spyOn(component, 'getUserData').and.callThrough();
    await component.ngOnInit();
    expect(component.getUserData).toHaveBeenCalled();
  });

  it('should retrieve user data', async () => {
    await authService.SignIn('dojefe6817@giratex.com', '123456');
    await component.getUserData();

    await component.ngOnInit();
    expect(component.myUser).toBeTruthy();
  });

  it('should retrieve company user data', async () => {
    await authService.SignIn('wasaf62813@evvgo.com', '123456');
    await component.getUserData();

    await component.ngOnInit();
    const Company = component.myUser as CompanyDTO;
    expect(Company.CompanyName).toEqual('Better call Saul');
  });

  it('should retrieve employee user data', async () => {
    await authService.SignIn('sanic29650@gosarlar.com', '123456');
    await component.getUserData();

    await component.ngOnInit();
    const Employee = component.myUser as EmployeeDTO;
    expect(Employee.CompanyName).toEqual('Better call Saul');
  });

  it('should retrieve public user data', async () => {
    await authService.SignIn('dojefe6817@giratex.com', '123456');
    await component.getUserData();
    await component.ngOnInit();
    const Public = component.myUser as UserDTO;
    expect(Public.FirstName).toEqual('Nick');
  });

  it('should set formUnsaved to true when form values change', async () => {
    // Arrange
    await authService.SignIn('dojefe6817@giratex.com', '123456');
    await component.getUserData();
    await component.ngOnInit();

    // Act
    await component.ngOnInit();
    component.profileForm.patchValue({
      FirstName: 'Jane',
      LastName: 'Smith',
      PhoneNumber: '9876543210',
      UserName: 'janesmith',
    });

    // Assert
    expect(component.formUnsaved).toBeTrue();
  });

  it('should set formUnsaved to false when form values are unchanged', async () => {
    // Arrange
    const mockUser = {
      FirstName: 'John',
      LastName: 'Doe',
      PhoneNumber: '(505) 503-4455',
      UserName: 'johndoe',
    };
    spyOn(authService, 'SignIn').and.returnValue(Promise.resolve());
    spyOn(component, 'getUserData').and.returnValue(Promise.resolve());
    component.myUser = mockUser;

    // Act
    await component.ngOnInit();
    component.profileForm.patchValue({
      FirstName: 'John',
      LastName: 'Doe',
      PhoneNumber: '(505) 503-4455',
      UserName: 'johndoe',
    });

    // Assert
    expect(component.formUnsaved).toBeFalse();
  });

  it('should set Uploading to false after initializing the form', async () => {
    // Arrange
    spyOn(authService, 'SignIn').and.returnValue(Promise.resolve());
    spyOn(component, 'getUserData').and.returnValue(Promise.resolve());

    // Act
    await component.ngOnInit();

    // Assert
    expect(component.Uploading).toBeFalse();
  });

  it('should display an alert if the form is invalid', () => {
    // Arrange
    spyOn(component.notificationService, 'sendAlert');
    component.profileForm.setErrors({ invalid: true });

    // Act
    component.onSubmit();

    // Assert
    expect(component.notificationService.sendAlert).toHaveBeenCalledWith(
      'Please fill out all required fields'
    );
  });

  it('should upload profile picture and update user', async () => {
    // Arrange

    await authService.SignIn('dojefe6817@giratex.com', '123456');
    await component.getUserData();
    await component.ngOnInit();
    const Public = component.myUser as UserDTO;

    spyOn(component.notificationService, 'sendNotification');
    spyOn(component.userService, 'updateUser');
    spyOn(component.storageService, 'deleteFile').and.returnValue(
      Promise.resolve()
    );
    spyOn(component.storageService, 'uploadToFirestore').and.returnValue(
      Promise.resolve('download-link')
    );
    spyOn(component, 'onEditUser').and.returnValue(Promise.resolve());
    spyOn(component, 'getUserData').and.returnValue(Promise.resolve());

    component.profileForm.patchValue({
      FirstName: Public.FirstName,
      LastName: Public.LastName,
      PhoneNumber: Public.PhoneNumber,
      UserName: Public.UserName,
    });
    component.file = new File([], 'profile-picture.jpg');

    // Act
    await component.onSubmit();

    // Assert
    expect(component.storageService.deleteFile).toHaveBeenCalled();
    expect(component.storageService.uploadToFirestore).toHaveBeenCalled();
    expect(component.onEditUser).toHaveBeenCalled();
    expect(component.getUserData).toHaveBeenCalled();
    expect(component.userService.updateUser).toHaveBeenCalled();
    expect(component.notificationService.sendNotification).toHaveBeenCalledWith(
      'Profile Updated'
    );
    expect(component.formUnsaved).toBeFalse();
  });

  it('should update user without uploading profile picture', async () => {
    // Arrange
    await authService.SignIn('dojefe6817@giratex.com', '123456');
    await component.getUserData();
    await component.ngOnInit();
    const Public = component.myUser as UserDTO;
    spyOn(component.notificationService, 'sendNotification');
    spyOn(component.userService, 'updateUser');
    spyOn(component.storageService, 'deleteFile').and.returnValue(
      Promise.resolve()
    );
    spyOn(component.storageService, 'uploadToFirestore').and.returnValue(
      Promise.resolve('download-link')
    );
    spyOn(component, 'onEditUser').and.returnValue(Promise.resolve());
    spyOn(component, 'getUserData').and.returnValue(Promise.resolve());

    component.profileForm.patchValue({
      FirstName: Public.FirstName,
      LastName: Public.LastName,
      PhoneNumber: Public.PhoneNumber,
      UserName: Public.UserName,
    });

    // Act
    await component.onSubmit();

    // Assert
    expect(component.storageService.deleteFile).not.toHaveBeenCalled();
    expect(component.storageService.uploadToFirestore).not.toHaveBeenCalled();
    expect(component.onEditUser).toHaveBeenCalled();
    expect(component.getUserData).toHaveBeenCalled();
    expect(component.userService.updateUser).toHaveBeenCalled();
    expect(component.notificationService.sendNotification).toHaveBeenCalledWith(
      'Profile Updated'
    );
    expect(component.formUnsaved).toBeFalse();
  });

  it('should reset form and file input field after submission', async () => {
    // Arrange
    await authService.SignIn('dojefe6817@giratex.com', '123456');
    await component.getUserData();
    await component.ngOnInit();
    const Public = component.myUser as UserDTO;
    component.profileForm.patchValue({
      FirstName: Public.FirstName,
      LastName: Public.LastName,
      PhoneNumber: Public.PhoneNumber,
      UserName: Public.UserName,
    });

    // Act
    await component.onSubmit();

    // Assert
    expect(component.file).toBeNull();
    expect(component.profilePictureLink).toEqual('');
    const profilePictureControl = component.profileForm.get('ProfilePicture');
    if (profilePictureControl) {
      expect(profilePictureControl.value).toBeNull();
    }
  });
});
