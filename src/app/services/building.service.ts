import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { equalTo, get, getDatabase, onValue, orderByChild, query, ref, set, update } from 'firebase/database';
import { AuthService } from './auth.service';
import { CompanyDTO } from '../models/users';
import { UserService } from './user.service';
import {
  Building,
  Condo,
  ParkingLockerStatus,
  CondoStatus,
  CondoType,
} from '../models/properties';
import { BehaviorSubject, Observable } from 'rxjs';
/**
 * Service for managing building-related operations.
 */
@Injectable({
  providedIn: 'root',
})
export class BuildingService {
  /**
   * Constructor for BuildingService.
   *
   * @param authService - AuthService for handling authentication.
   * @param storageService - StorageService for handling file uploads and deletions.
   */

  public buildingsSubject: BehaviorSubject<Building[] | null> =
    new BehaviorSubject<Building[] | null>(null);
  buildings$: Observable<Building[] | null> =
    this.buildingsSubject.asObservable();

  private buildingSubject: BehaviorSubject<Building | null> =
    new BehaviorSubject<Building | null>(null);
  building$: Observable<Building | null> = this.buildingSubject.asObservable();

  public condoSubject: BehaviorSubject<Condo | null> =
    new BehaviorSubject<Condo | null>(null);
  condo$: Observable<Condo | null> = this.condoSubject.asObservable();

  private condosSubject: BehaviorSubject<Condo[] | null> = new BehaviorSubject<
    Condo[] | null
  >(null);
  condos$: Observable<Condo[] | null> = this.condosSubject.asObservable();

  constructor(
    public authService: AuthService,
    public storageService: StorageService,
    public userService: UserService
  ) {
    this.subscribeToBuildings();
  }

  /**
   * Adds a new building to the database.
   *
   * @param building - Building object to be added.
   * @returns A Promise that resolves when the building is successfully added.
   * @throws Error if there is an issue adding the building.
   */
  async addBuilding(building: Building): Promise<void> {
    try {
      const db = getDatabase();
      const generatedId = await this.storageService.IDgenerator(
        'buildings/',
        db
      );
      const currentUser = this.authService.getUser(); // Get the current authenticated user

      const user = await this.userService.getCompanyUser(currentUser.uid);

      if (!user) {
        throw new Error('User not found');
      }

      if (!user.PropertyIds) {
        user.PropertyIds = [];
      }
      user.PropertyIds.push(generatedId);
      // Update the user node with the updated property IDs array
      await this.userService.editUser(user.ID, user);

      building.ID = generatedId;
      building.CompanyID = currentUser.uid;

      const promiseCondos = building.Condos.map(async (condo) => {
        condo.ID = await this.storageService.IDgenerator('buildings/', db);
      });
      await Promise.all(promiseCondos);

      const promiseLockers = building.Lockers.map(async (locker) => {
        locker.ID = await this.storageService.IDgenerator('buildings/', db);
      });
      await Promise.all(promiseLockers);

      const promiseParking = building.Parkings.map(async (parking) => {
        parking.ID = await this.storageService.IDgenerator('buildings/', db);
      });
      await Promise.all(promiseParking);

      const NewbuildingRef = ref(db, `buildings/${generatedId}`);
      await set(NewbuildingRef, building);
    } catch (error) {
      console.error('Error adding Building:', error);
      throw error;
    }
  }

  /**
   * Retrieves a building by its ID from the database.
   *
   * @param buildingId - ID of the building to retrieve.
   * @returns A Promise that resolves with the retrieved Building.
   * @throws Error if the building is not found.
   */
  async getBuilding(buildingId: string): Promise<Building> {
    try {
      const db = getDatabase();
      const buildingRef = ref(db, `buildings/${buildingId}`);
      const buildingSnapshot = await get(buildingRef);

      if (buildingSnapshot.exists()) {
        const building = buildingSnapshot.val() as Building;
        return building;
      } else {
        throw new Error('Building not found');
      }
    } catch (error) {
      console.error('Error getting Building:', error);
      throw error;
    }
  }

  async getAllBuildingsWithItems(
    itemType: 'Condos' | 'Parkings' | 'Lockers'
  ): Promise<Building[]> {
    try {
      const db = getDatabase();
      const buildingsRef = ref(db, 'buildings');
      const buildingsSnapshot = await get(buildingsRef);

      if (buildingsSnapshot.exists()) {
        const buildings: Building[] = [];

        // Iterate through each building
        buildingsSnapshot.forEach((buildingChild) => {
          const buildingData = buildingChild.val() as Building;

          // Extract the building ID from the building data
          const buildingId = buildingData.ID;

          // Construct the building object
          const building: Building = {
            ...buildingData,
            ID: buildingId,
          };

          // Fetch items of the specified type for this building
          const items: any[] = [];
          const itemsSnapshot = buildingChild.child(itemType);
          itemsSnapshot.forEach((itemChild) => {
            const itemData = itemChild.val();
            const item: any = {
              id: itemChild.key,
              ...itemData,
            };
            items.push(item);
          });

          // Assign items to the building
          building[itemType] = items;

          // Push the building with items to the array
          buildings.push(building);
        });

        return buildings;
      } else {
        throw new Error('No buildings found');
      }
    } catch (error) {
      console.error('Error getting buildings with items:', error);
      throw error;
    }
  }
  /**
   * Updates an existing building in the database.
   *
   * @param building - Updated Building object.
   * @returns A Promise that resolves when the building is successfully updated.
   * @throws Error if there is an issue updating the building.
   */
  async updateBuilding(building: Building): Promise<void> {
    try {
      const db = getDatabase();
      const buildingRef = ref(db, `buildings/${building.ID}`);
      await set(buildingRef, building);
    } catch (error) {
      console.error('Error updating Building:', error);
      throw error;
    }
  }

  async updateItem(
    buildingId: string,
    itemType: 'Condos' | 'Parkings' | 'Lockers',
    itemId: string,
    occupantId: string
  ): Promise<void> {
    try {
      const db = getDatabase();
      const buildingRef = ref(db, `buildings/${buildingId}/${itemType}`);
      const itemsSnapshot = await get(buildingRef);

      if (itemsSnapshot.exists()) {
        itemsSnapshot.forEach((itemChild) => {
          const itemData = itemChild.val();
          if (itemData.ID === itemId) {
            const occupantIdRef = ref(
              db,
              `buildings/${buildingId}/${itemType}/${itemChild.key}/OccupantID`
            );
            set(occupantIdRef, occupantId);

            // Update status for parkings and lockers
            if (itemType === 'Parkings' || itemType === 'Lockers') {
              const statusRef = ref(
                db,
                `buildings/${buildingId}/${itemType}/${itemChild.key}/Status`
              );
              set(statusRef, ParkingLockerStatus.Unavailable);
            }

            // Update status for condos based on Type
            if (itemType === 'Condos') {
              const condoRef = ref(
                db,
                `buildings/${buildingId}/${itemType}/${itemChild.key}/Status`
              );
              const condoSnapshot = itemChild.val() as Condo;
              if (condoSnapshot.Type === CondoType.Sale) {
                set(condoRef, CondoStatus.Owned);
              } else if (condoSnapshot.Type === CondoType.Rent) {
                set(condoRef, CondoStatus.Rented);
              }
            }
          }
        });
      }
    } catch (error) {
      console.error('Error updating building item:', error);
      throw error;
    }
  }

  /**
   * Deletes a building and its associated files from the database.
   *
   * @param buildingId - ID of the building to delete.
   * @returns A Promise that resolves when the building is successfully deleted.
   * @throws Error if there is an issue deleting the building.
   */
  async deleteBuilding(buildingId: string): Promise<void> {
    try {
      let building: Building = await this.getBuilding(buildingId);
      const db = getDatabase();
      const userRef = ref(db, `companies/${building.CompanyID}`);
      const userSnapshot = await get(userRef);
      if (userSnapshot.exists()) {
        const user = userSnapshot.val() as CompanyDTO;
        user.PropertyIds = user.PropertyIds.filter((id) => id !== buildingId);
        await set(userRef, user);
      }
      const buildingRef = ref(db, `buildings/${buildingId}`);
      await set(buildingRef, null);
      await this.storageService.deleteFile(building.Picture);
      await this.storageService.deleteFile(building.Condos[0].Picture);
      for (let i = 1; i < building.Condos.length; i++) {
        if (building.Condos[i].Picture !== building.Condos[i - 1].Picture) {
          await this.storageService.deleteFile(building.Condos[i].Picture);
        }
      }
    } catch (error) {
      console.error('Error deleting Building:', error);
      throw error;
    }
  }

  /**
   * Retrieves all deliveries from the 'buildings' node and calls when with real time updatein Firebase Realtime Database.
   * @returns A callback returning an array of all Building objects.
   */
  subscribeToBuildings() {
    const db = getDatabase();
    const buildingsRef = ref(db, 'buildings');

    onValue(buildingsRef, (snapshot) => {
      if (snapshot.exists()) {
        const buildings = snapshot.val() as Building[];
        this.buildingsSubject.next(buildings);
      } else {
        this.buildingsSubject.next(null);
      }
    });
  }

  /**
   * Subscribe to real-time updates for a specific building.
   *
   * @param buildingId - ID of the building to subscribe to.
   * @returns An observable that emits updates for the specified building.
   */
  subscribeToBuildingById(buildingId: string): Observable<Building | null> {
    const db = getDatabase();
    const buildingRef = ref(db, `buildings/${buildingId}`);

    onValue(buildingRef, (snapshot) => {
      if (snapshot.exists()) {
        const building = snapshot.val() as Building;
        this.buildingSubject.next(building);
      } else {
        this.buildingSubject.next(null);
      }
    });

    return this.building$;
  }

    /**
   * Subscribe to real-time updates for a specific condo.
   *
   * @param condoId - ID of the condo to subscribe to.
   * @returns An observable that emits updates for the specified building.
   */
    subscribeToCondoById(buildingID: string, condoID: string): Observable<Condo | null> {
      const db = getDatabase();
      const buildingRef = ref(db, `buildings/${buildingID}`);

      onValue(buildingRef, (snapshot) => {
        if (snapshot.exists()) {
          const building = snapshot.val() as Building;
          let foundCondo: Condo | null = null;
    
          // Iterate over each condo in the building
          for (const condoId in building.Condos as Condo[]) {
            const condo: Condo = building.Condos[condoId];
    
            // If the condo ID matches the desired ID, store the condo and break the loop
            if (condo.ID === condoID) {
              foundCondo = condo;
              break;
            }
          }
    
          this.condoSubject.next(foundCondo);
        } else {
          this.condoSubject.next(null);
        }
      });
    
      return this.condo$;
    }

        /**
      * Updates the condo fee for a specific condo in a building.
      *
      * @param buildingID - ID of the building.
      * @param condo - Condo object to update.
      * @param fee - New condo fee.
      * @returns A Promise that resolves when the condo fee is successfully updated.
      */
    updateCondoFee(buildingID: string, condo: Condo, fee: number): Promise<void> {
      return new Promise((resolve, reject) => {
        const db = getDatabase();
        const condoRef = ref(db, `buildings/${buildingID}/Condos`);
    
        get(condoRef).then((snapshot) => {
          if (snapshot.exists()) {
            const condosFromDb = snapshot.val();
            for (let key in condosFromDb) {
              const condoFromDb = condosFromDb[key] as Condo;
              if (condoFromDb.ID === condo.ID) {
                // Found the correct condo, now update the CondoFee
                console.log("GOOD");
                const condoRef = ref(db, `buildings/${buildingID}/Condos/${key}`);
                update(condoRef, { CondoFee: fee }).then(() => {
                  resolve();
                });
                break;
              }
            }
          } 
        });
      });
    }

    /**
     * Checks the parkings owned by a specific user in a building.
     *
     * @param buildingID - ID of the building.
     * @param userID - ID of the user.
     * @returns A Promise resolving to an array of ParkingSpot objects owned by the user.
     * @throws Error if there is an issue retrieving the parkings.
     */
    getUserParkings(buildingID: string, userID: string): Promise<ParkingSpot[]> {
      return new Promise((resolve, reject) => {
        const db = getDatabase();
        const parkingRef = ref(db, `buildings/${buildingID}/Parkings`);
    
        get(parkingRef).then((snapshot) => {
          if (snapshot.exists()) {
            const parkingsFromDb = snapshot.val();
            const userParkings: ParkingSpot[] = [];
            for (let key in parkingsFromDb) {
              const parkingFromDb: ParkingSpot = parkingsFromDb[key];
              if (parkingFromDb.OccupantID === userID) {
                // Found a parking owned by the user
                userParkings.push(parkingFromDb);
              }
            }
            // Return the array of parkings owned by the user
            resolve(userParkings);
          } else {
            reject(new Error('No parkings found'));
          }
        }).catch((error) => reject(error));
      });
    }

  /**
   * Retrieves all buildings from the 'buildings' node in Firebase Realtime Database.
   * @returns A Promise resolving to an array of all Building objects.
   */
  async getAllBuildings(): Promise<Building[]> {
    try {
      const db = getDatabase();
      const buildingsRef = ref(db, 'buildings');

      const snapshot = await get(buildingsRef);
      const buildings: Building[] = [];

      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const building = childSnapshot.val() as Building;
          buildings.push(building);
        });
      }

      return buildings;
    } catch (error) {
      console.error('Error getting all buildings:', error);
      throw error;
    }
  }
  /**
   * Retrieves all buildings of a specific company from the 'buildings' node in Firebase Realtime Database.
   * @returns A Promise resolving to an array of all Building objects.
   */
  async getAllBuildingsOfCompany(companyId: string): Promise<Building[]> {
    try {
      const db = getDatabase();
      const buildingsRef = ref(db, 'buildings');

      const snapshot = await get(buildingsRef);
      const buildings: Building[] = [];

      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const building = childSnapshot.val() as Building;
          if (building.CompanyID === companyId) {
            buildings.push(building);
          }
        });
      }

      return buildings;
    } catch (error) {
      console.error('Error getting all buildings:', error);
      throw error;
    }
  }
}
