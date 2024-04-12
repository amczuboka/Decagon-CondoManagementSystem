import { TestBed } from '@angular/core/testing';
import { AppModule } from '../app.module';

import { BookingsService } from './bookings.service';
import { Booking, Facilities } from '../models/properties';

describe('BookingsService', () => {
  let service: BookingsService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [AppModule],
    });
    service = TestBed.inject(BookingsService);
    await service.authService.SignIn('dojefe6817@giratex.com', '123456');
  });

  afterEach(async () => {
    await service.authService.SignOut();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a new booking to the building and the user then delete it', async () => {
    // Arrange
    const buildingID = 'gc2c37wrny1712213167948';
    const booking: Booking = {
      ID: '',
      OccupantID: '',
      Facility: Facilities.Gym,
      Date: 0,
    };

    // Act
    await service.addNewBooking(buildingID, booking);
    const currentUser = service.authService.getUser();
    const user = await service.userService.getPublicUser(currentUser.uid);

    if (user && user.Bookings) {
      // Assert
      // Check if the booking is added to the building
      const building = await service.buildingService.getBuilding(buildingID);
      expect(
        building.Bookings.some((booking) => booking.Date === 0)
      ).toBeTruthy();

      expect(user?.Bookings.some((booking) => booking.Date === 0)).toBeTruthy();

      // Act
      const UserDeleteBookings = user.Bookings.map(async (booking) => {
        await service.removeBooking(buildingID, booking.ID);
      });
      await Promise.all(UserDeleteBookings);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Assert
      // Check if the booking is removed from the building
      const building2 = await service.buildingService.getBuilding(buildingID);
   expect(
     building2.Bookings === undefined ||
       !building2.Bookings.some((booking) => booking.Date === 0)
   ).toBeTruthy();
      const user2 = await service.userService.getPublicUser(currentUser.uid);

      expect(user2?.Bookings).toBeUndefined();
      console.log(user2);
      console.log(building);
    } else {
      fail('User not found');
    }
  }, 20000);
});
