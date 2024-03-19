import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Building } from '../models/properties';
import { get, getDatabase, ref, set } from 'firebase/database';
import { AuthService } from './auth.service';
import { CompanyDTO } from '../models/users';
import { UserService } from './user.service';
import { Condo } from '../models/properties';

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
  constructor(
    public authService: AuthService,
    public storageService: StorageService,
    public userService: UserService
  ) {}

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

  async getAllBuildingsWithCondos(): Promise<Building[]> {
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
          const buildingId = buildingData.ID; // Assuming 'ID' is the property name
  
          // Construct the building object
          const building: Building = {
            ...buildingData,
            ID: buildingId
          };
  
          // Fetch condos for this building
          const condos : Condo[]=[];
          const condosSnapshot = buildingChild.child('Condos');
          condosSnapshot.forEach((condoChild) => {
            const condoData = condoChild.val();
            const condo: Condo = {
              id: condoChild.key,
              ...condoData,
            };
            condos.push(condo);
          });
  
          // Assign condos to the building
          building.Condos = condos;
  
          // Push the building with condos to the array
          buildings.push(building);
        });
  
        return buildings;
      } else {
        throw new Error('No buildings found');
      }
    } catch (error) {
      console.error('Error getting buildings with condos:', error);
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

  /**
   * Updates an existing building in the database.
   *
   * @param condoId - Updated CondoID.
   * @param buildingId - BuildingId.
   * @param occupantId - occupant id.
   * @returns A Promise that resolves when the condo is successfully updated.
   * @throws Error if there is an issue updating the condo.
   */
  async updateCondo(buildingId: string, condoId: string, occupantId: string): Promise<void> {
    try {
      const db = getDatabase();
      const buildingRef= ref(db, `buildings/${buildingId}/Condos`);
      const condosSnapshot = await get(buildingRef);

      if (condosSnapshot.exists()) {
        condosSnapshot.forEach((condoChild) => {
          const condoData = condoChild.val();
          if (condoData.ID === condoId) {
            const occupantIdRef = ref(db, `buildings/${buildingId}/Condos/${condoChild.key}/OccupantID`);
            set(occupantIdRef, occupantId);
          }
        })
      }
    } catch (error) {
      console.error('Error updating Building:', error);
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
    } catch (error) {
      console.error('Error deleting Building:', error);
      throw error;
    }
  }
}
