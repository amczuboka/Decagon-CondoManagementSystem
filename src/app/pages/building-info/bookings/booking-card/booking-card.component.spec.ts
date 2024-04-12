import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from 'src/app/app.module';
import { MatIconModule } from '@angular/material/icon';
import { BookingCardComponent } from './booking-card.component';
import { BookingsService } from 'src/app/services/bookings.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Booking, Building, Facilities } from 'src/app/models/properties';
import { UserDTO, Authority} from 'src/app/models/users';

describe('BookingCardComponent', () => {
  let bookingsService: BookingsService;
  let notificationService: NotificationService;
  let component: BookingCardComponent;
  let fixture: ComponentFixture<BookingCardComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
        MatIconModule,
      ],
      declarations: [BookingCardComponent]
    });
    fixture = TestBed.createComponent(BookingCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    bookingsService = TestBed.inject(BookingsService);
    notificationService = TestBed.inject(NotificationService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should initialize component', () => {
    const userServiceSpy = spyOn(
      component.userService['myUserSubject'],
      'next'
    ).and.callThrough();
    const myUser: UserDTO = {
      FirstName: 'John',
      LastName: 'Doe',
      ID: '1',
      Authority: Authority.Employee,
      Email: '',
      ProfilePicture: '',
      PhoneNumber: '',
      UserName: ''
    };
    component.userService.updateUser(myUser);
    component.ngOnInit();
    expect(userServiceSpy).toHaveBeenCalledWith(myUser);
  });

});
