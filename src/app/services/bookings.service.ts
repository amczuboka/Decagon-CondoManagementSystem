import { Injectable } from '@angular/core';
import { Booking, Building } from '../models/properties';
import { get, getDatabase, ref, set } from 'firebase/database';
import { StorageService } from 'src/app/services/storage.service';
import { BuildingService } from './building.service';

@Injectable({
  providedIn: 'root',
})
export class BookingsService {
  constructor(
    public storageService: StorageService,
    public buildingService: BuildingService
  ) {}

  //Adds new booking to the database

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
}
