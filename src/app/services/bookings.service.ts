import { Injectable } from '@angular/core';
import { Booking, Building } from '../models/properties';
import { get, getDatabase, ref, set } from 'firebase/database';
import { StorageService } from 'src/app/services/storage.service';
import { BuildingService } from './building.service';
import { String } from 'cypress/types/lodash';

@Injectable({
  providedIn: 'root',
})
export class BookingsService {
  constructor(
    public storageService: StorageService,
    public buildingService: BuildingService
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
      building.Bookings.push(booking);
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
