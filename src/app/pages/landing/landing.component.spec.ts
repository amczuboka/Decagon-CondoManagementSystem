import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { LandingComponent } from './landing.component';
import { BuildingComponent } from 'src/app/components/building/building.component';
import { AppModule } from 'src/app/app.module';
import { of } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;
  let userService: UserService;

  beforeEach(() => {
    const user = {
      FirstName: 'John',
      LastName: 'Doe',
      ID: '123',
      Authority: 'Public',
      Email: '',
      ProfilePicture: '',
      PhoneNumber: '',
      UserName: '',
    };
    const userServiceMock = {
      myUser: of(user),
      updateUser: jasmine.createSpy('updateUser').and.stub(),
    };

    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [LandingComponent, BuildingComponent],
      providers: [{ provide: UserService, useValue: userServiceMock }],
    });

    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to myUser on init', fakeAsync(() => {
    // Arrange
    const user = {
      FirstName: 'John',
      LastName: 'Doe',
      ID: '123',
      Authority: 'Public',
      Email: '',
      ProfilePicture: '',
      PhoneNumber: '',
      UserName: '',
    };
    userService.myUser = of(user); // Replace myUser with a mock Observable
    (userService.updateUser as jasmine.Spy).and.stub(); // Makes updateUser a no-op

    // Act
    component.onInit(); // Call ngOnInit manually
    tick(); // Simulate the passage of time until all pending asynchronous activities finish

    // Assert
    expect(component.myUser).toEqual(user);
  }));

  it('should unsubscribe from userSubscription on ngOnDestroy', () => {
    // Arrange
    const unsubscribeSpy = spyOn(component.userSubscription, 'unsubscribe');

    // Act
    component.ngOnDestroy();

    // Assert
    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
