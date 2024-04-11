import { Injectable } from '@angular/core';
import { Booking, Building } from '../models/properties';
import { get, getDatabase, ref, set } from 'firebase/database';
import { StorageService } from 'src/app/services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class BookingsService {

  constructor(
    public storageService: StorageService,
  ) { }

  //Adds new booking to the database


  async addNewBooking(buildingID: string, booking: Booking): Promise<void>{
    try{
      const db = getDatabase();
      const buildingRef = ref(db, `buildings/${buildingID}`);
      const buildingSnapshot = await get(buildingRef);

      if (buildingSnapshot.exists()){
        const building = buildingSnapshot.val() as Building;

        if (!building.Bookings){
          building.Bookings = [];
        }
        
        booking.ID = await this.storageService.IDgenerator(`buildings/${buildingID}`, db)
        building.Bookings.push(booking);
        await set(buildingRef, building);
      } else {
        throw new Error('Building not found');
      }

    } catch (error){
      console.log('Error adding booking', error);
      throw error;
    }
  }

}
