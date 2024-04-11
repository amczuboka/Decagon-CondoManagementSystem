import { Injectable } from '@angular/core';
import { Booking, Building } from '../models/properties';
import { get, getDatabase, ref, set } from 'firebase/database';
import { StorageService } from 'src/app/services/storage.service';
import { BuildingService } from './building.service';
import { String } from 'cypress/types/lodash';
import { UserService } from './user.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class BookingsService {
  constructor(
    public storageService: StorageService,
    public buildingService: BuildingService,
    public authService: AuthService,
    public userService: UserService
  ) {}

  
  /**
   * Adds new booking to building
   * @param buildingID 
   * @param booking 
   */  
  async addNewBooking(buildingID: string, booking: Booking): Promise<void> {
    try {
      const db = getDatabase();
      const building = await this.buildingService.getBuilding(buildingID);

      if (!building.Bookings) {
        building.Bookings = [];
      }

      booking.ID = await this.storageService.IDgenerator(
        `buildings/${buildingID}`,
        db
      );
      //push booking
      building.Bookings.push(booking);

      //Get user
      const currentUser = this.authService.getUser(); // Get the current authenticated user

      const user = await this.userService.getPublicUser(currentUser.uid);

      if (!user) {
        throw new Error('User not found');
      }

      if (!user.Bookings) {
        user.Bookings = [];
      }
      user.Bookings.push(booking);
      // Update the user node with the updated booking array
      await this.userService.editUser(user.ID, user);

      await this.buildingService.updateBuilding(building);
    } catch (error) {
      console.log('Error adding booking', error);
      throw error;
    }
  }


  /**
   * Removes booking from building
   * @param buildingID 
   * @param bookingID 
   */  
  async removeBooking(buildingID: string, bookingID: string): Promise<void> {
    try {
      const db = getDatabase();
      const building = await this.buildingService.getBuilding(buildingID);

      if (!building.Bookings) {
        building.Bookings = [];
      }

      building.Bookings = building.Bookings.filter(booking => booking.ID !== bookingID);
      await this.buildingService.updateBuilding(building);
    } catch (error) {
      console.log('Error removing booking', error);
      throw error;
    }
  }




}
