import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ParkingSpotComponent } from './parking-spot.component';
import { AuthService } from 'src/app/services/auth.service';
import { AppModule } from 'src/app/app.module';
import { UserService } from 'src/app/services/user.service';
import { Authority, UserDTO } from 'src/app/models/users';

describe('ParkingSpotComponent', () => {
  let component: ParkingSpotComponent;
  let fixture: ComponentFixture<ParkingSpotComponent>;
  let authService: AuthService;
  let userService: UserService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [ParkingSpotComponent],
    });

    fixture = TestBed.createComponent(ParkingSpotComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    userService = TestBed.inject(UserService);

    // Mock authService.getUser to return a user
    spyOn(authService, 'getUser').and.returnValue({ photoURL: 'some-url', FirstName: 'Nick', LastName: 'Pip' });    
    
    // Mock userService.getPublicUser to return a public user
    spyOn(userService, 'getPublicUser').and.returnValue(Promise.resolve<UserDTO | null>({
      FirstName: "",
      LastName: "",
      ID: "",
      Authority: Authority.Public,
      Email: "",
      ProfilePicture: "",
      PhoneNumber: "",
      UserName: "",
      Notifications: []
    }));

    fixture.detectChanges();
  });

  afterEach(async () => {
    await authService.SignOut();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize users', fakeAsync(() => {
    component.ngOnInit();
    tick();

    // Assert: Check if this.users is truthy
    expect(component.users).toBeTruthy();
  }));

  it('should set myUser and authority when ngAfterViewChecked is called', fakeAsync(() => {
    component.ngAfterViewChecked();
    tick();

    // Assert if both myUser and authority are truthy
    expect(component.myUser).toBeTruthy();
    expect(component.authority).toBeTruthy();
  }));
});
