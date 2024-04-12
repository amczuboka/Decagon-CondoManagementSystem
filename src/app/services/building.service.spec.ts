import { StorageService } from 'src/app/services/storage.service';
import { TestBed } from '@angular/core/testing';

import { AppModule } from '../app.module';
import { BuildingService } from './building.service';
import { UserService } from './user.service';
import { CompanyDTO } from '../models/users';
import { AuthService } from './auth.service';
import {
  Booking,
  Building,
  Condo,
  CondoStatus,
  CondoType,
  Facilities,
  Locker,
  ParkingLockerStatus,
  ParkingSpot,
  ParkingType,
} from '../models/properties';
import { getDatabase } from 'firebase/database';

describe('BuildingService', () => {
  let service: BuildingService;
  let building: Building;
  let buildings: Building[];
  let userService: UserService;
  let storageService: StorageService;
  let condoImage: File;
  let buildingImage: File;
  let authService: AuthService;

  beforeEach(async () => {

    TestBed.configureTestingModule({
      imports: [AppModule],
    });
    service = TestBed.inject(BuildingService);
    authService = TestBed.inject(AuthService);
    storageService = TestBed.inject(StorageService);
    userService = TestBed.inject(UserService);
    const db = getDatabase();
    await authService.SignIn('mejisej966@mcuma.com', '123456');
    await storageService.deleteFolderContents('test_images');

    buildingImage = new File(['file content'], 'test.txt', {
      type: 'text/plain',
    });
    condoImage = new File(['file content'], 'test2.txt', {
      type: 'text/plain',
    });

    const bookingsArray: Booking[] = [
      {
        ID: '1',
        OccupantID: 'occupant1',
        Facility: Facilities.Gym,
        Date: Date.now(),
      },
      {
        ID: '2',
        OccupantID: 'occupant2',
        Facility: Facilities.Pool,
        Date: Date.now() + 86400000, // Adding one day in milliseconds
      },
      {
        ID: '3',
        OccupantID: 'occupant3',
        Facility: Facilities.MeetingRoom,
        Date: Date.now() + 172800000, // Adding two days in milliseconds
      },
    ];

    const parkingsArray: ParkingSpot[] = [
      {
        ID: '1',
        OccupantID: 'occupant1',
        Number: 'P101',
        Status: ParkingLockerStatus.Available,
        ParkingType: ParkingType.Standard,
        Fee: 50,
      },
      {
        ID: '2',
        OccupantID: 'occupant2',
        Number: 'P202',
        Status: ParkingLockerStatus.Unavailable,
        ParkingType: ParkingType.Handicap,
        Fee: 75,
      },
      {
        ID: '3',
        OccupantID: 'occupant3',
        Number: 'P303',
        Status: ParkingLockerStatus.Available,
        ParkingType: ParkingType.Standard,
        Fee: 60,
      },
    ];

    const lockersArray: Locker[] = [
      {
        ID: '1',
        OccupantID: 'occupant1',
        Number: 'L101',
        Status: ParkingLockerStatus.Available,
        Height: '60cm',
        Width: '30cm',
        Length: '45cm',
        Fee: 20,
      },
      {
        ID: '2',
        OccupantID: 'occupant2',
        Number: 'L202',
        Status: ParkingLockerStatus.Unavailable,
        Height: '80cm',
        Width: '40cm',
        Length: '60cm',
        Fee: 25,
      },
      {
        ID: '3',
        OccupantID: 'occupant3',
        Number: 'L303',
        Status: ParkingLockerStatus.Available,
        Height: '70cm',
        Width: '35cm',
        Length: '50cm',
        Fee: 22,
      },
    ];
    const image = await storageService.uploadToFirestore(
      condoImage,
      'test_images/' + (await storageService.IDgenerator('buildings/', db))
    );
    const condosArray: Condo[] = [
      {
        ID: '1',
        Type: CondoType.Sale,
        OccupantID: 'occupant1',
        UnitNumber: 'C101',
        Fee: 200000,
        Picture: image,
        Description: 'Spacious condo with a great view.',
        NumberOfBedrooms: 2,
        NumberOfBathrooms: 2,
        Status: CondoStatus.Owned,
        SquareFootage: 1200,
      },
      {
        ID: '2',
        Type: CondoType.Rent,
        OccupantID: 'occupant2',
        UnitNumber: 'C202',
        Fee: 1500,
        Picture: image,
        Description: 'Modern condo with high-end amenities.',
        NumberOfBedrooms: 1,
        NumberOfBathrooms: 1,
        Status: CondoStatus.Rented,
        SquareFootage: 800,
      },
      {
        ID: '3',
        Type: CondoType.Sale,
        OccupantID: 'occupant3',
        UnitNumber: 'C303',
        Fee: 180000,
        Picture: image,
        Description: 'Luxurious condo in a prime location.',
        NumberOfBedrooms: 3,
        NumberOfBathrooms: 2,
        Status: CondoStatus.Vacant,
        SquareFootage: 1500,
      },
    ];

    const facilitiesArray: Facilities[] = [
      Facilities.Gym,
      Facilities.Pool,
      Facilities.Spa,
      Facilities.Locker,
      Facilities.Parking,
      Facilities.Playground,
      Facilities.MeetingRoom,
      Facilities.Gym,
      Facilities.Pool,
      Facilities.Spa,
    ];

    building = {
      ID: '',
      Year: 1999,
      CompanyID: '',
      Name: 'Test Building',
      Address: '200 Lansdowne Ave, Westmount, Quebec, Canada H3Z 3E1',
      Bookings: bookingsArray,
      Description: 'This is a test building',
      Parkings: parkingsArray,
      Lockers: lockersArray,
      Condos: condosArray,
      Picture: await storageService.uploadToFirestore(
        buildingImage,
        'test_images/' + (await storageService.IDgenerator('buildings/', db))
      ),
      Facilities: facilitiesArray,
    };

    buildings = [
      {
        ID: '1',
        Name: 'Building 1',
        Address: 'Address 1',
        Year: 2022,
        CompanyID: 'company1',
        Bookings: bookingsArray,
        Description: 'Building 1 description',
        Parkings: parkingsArray,
        Lockers: lockersArray,
        Condos: condosArray,
        Picture: '',
        Facilities: facilitiesArray,
      },
      {
        ID: '2',
        Name: 'Building 2',
        Address: 'Address 2',
        Year: 2023,
        CompanyID: 'company2',
        Bookings: bookingsArray,
        Description: 'Building 2 description',
        Parkings: parkingsArray,
        Lockers: lockersArray,
        Condos: condosArray,
        Picture: '',
        Facilities: facilitiesArray,
      },
    ];
  });

  afterEach(async () => {
    authService = TestBed.inject(AuthService);
    storageService.deleteFile(building.Picture);
    storageService.deleteFile(building.Condos[0].Picture);
    authService.SignOut();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a new building and update the user', async () => {
    spyOn(authService, 'getUser').and.returnValue(
      JSON.parse(localStorage.getItem('user')!)
    );
    // Act
    await service.addBuilding(building);
    const builder = await service.getBuilding(building.ID);
    expect(builder).toEqual(building);

    const user: CompanyDTO = (await userService.getCompanyUser(
      authService.getUser().uid
    )) as CompanyDTO;

    expect(user.PropertyIds).toContain(building.ID);

    // Assert
    expect(authService.getUser).toHaveBeenCalled();

    // Clean up
    await service.deleteBuilding(building.ID);
  });

  it('should throw an error if user is not found', async () => {
    // Arrange
    spyOn(userService, 'getCompanyUser').and.returnValue(Promise.resolve(null));

    // Act & Assert
    await expectAsync(service.addBuilding(building)).toBeRejectedWithError(
      'User not found'
    );
  });

  it('should throw an error if an error occurs during the process', async () => {
    spyOn(storageService, 'IDgenerator').and.throwError('Some error');

    // Act & Assert
    await expectAsync(service.addBuilding(building)).toBeRejectedWithError(
      'Some error'
    );
  });

  it('should get a building successfully', async () => {
    await service.addBuilding(building);
    // Act
    const result = await service.getBuilding(building.ID);

    expect(result).toEqual(building);

    //clean up
    await service.deleteBuilding(building.ID);
  });

  it('should throw an error if building is not found', async () => {
    // Act & Assert
    await expectAsync(
      service.getBuilding(building.ID + '1')
    ).toBeRejectedWithError('Building not found');
  });

  it('should update a building successfully', async () => {
    // Arrange
    const building2: Building = building;
    building2.Name = 'Updated Building';
    await service.addBuilding(building);
    // Act
    await service.updateBuilding(building2);
    const result = await service.getBuilding(building.ID);
    expect(result).toEqual(building2);

    //clean up
    await service.deleteBuilding(building.ID);
  });

  it('should delete a building successfully', async () => {
    // Arrange
    await service.addBuilding(building);

    spyOn(service, 'getBuilding').and.returnValue(Promise.resolve(building));
    spyOn(service.storageService, 'deleteFile').and.returnValue(
      Promise.resolve()
    );

    const building2 = await service.getBuilding(building.ID);

    // Act
    await service.deleteBuilding(building2.ID);

    // Assert
    expect(service.getBuilding).toHaveBeenCalledWith(building2.ID);
    expect(service.storageService.deleteFile).toHaveBeenCalledTimes(2);
    expect(service.storageService.deleteFile).toHaveBeenCalledWith(
      building2.Picture
    );
    expect(service.storageService.deleteFile).toHaveBeenCalledWith(
      building2.Condos[0].Picture
    );
  });
  // 
  ////////////////////////////////
  it('should get all buildings with condos successfully', async () => {
    // Arrange
    await service.addBuilding(building);

    // Act
    const result = await service.getAllBuildingsWithItems('Condos');

    // Assert
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].Condos.length).toBeGreaterThan(0);
    expect(result[0].Condos[0]).toBeTruthy(); // Check if condo exists
expect(result[0].Condos[0].ID).toBeDefined(); // Check if condo has ID property
expect(result[0].Condos[0].Type).toBeDefined()

    // Clean up
    await service.deleteBuilding(building.ID);
  });

  it('should get all buildings with parkings successfully', async () => {
    // Arrange
    await service.addBuilding(building);

    // Act
    const result = await service.getAllBuildingsWithItems('Parkings');

    // Assert
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].Parkings.length).toBeGreaterThan(0);
    expect(result[0].Parkings[0]).toBeTruthy(); // Check if parking spot exists
expect(result[0].Parkings[0].ID).toBeDefined(); // Check if parking spot has ID property
expect(result[0].Parkings[0].Status).toBeDefined();

    // Clean up
    await service.deleteBuilding(building.ID);
  });

  it('should get all buildings with lockers successfully', async () => {
    // Arrange
    await service.addBuilding(building);

    // Act
    const result = await service.getAllBuildingsWithItems('Lockers');

    // Assert
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].Lockers.length).toBeGreaterThan(0);
    expect(result[0].Lockers[0]).toBeTruthy(); // Check if locker exists
expect(result[0].Lockers[0].ID).toBeDefined(); // Check if locker has ID property
expect(result[0].Lockers[0].Status).toBeDefined();

    // Clean up
    await service.deleteBuilding(building.ID);
  });

  it('should update item successfully', async () => {
    // Arrange
    await service.addBuilding(building);

    // Act
    await service.updateItem(building.ID, 'Condos', building.Condos[0].ID, 'newOccupantId');

    // Assert
    const updatedBuilding = await service.getBuilding(building.ID);
    expect(updatedBuilding.Condos[0].OccupantID).toEqual('newOccupantId');

    // Clean up
    await service.deleteBuilding(building.ID);
  });

  it('should update item successfully with status updates for condos', async () => {
    // Arrange
    await service.addBuilding(building);

    // Act
    await service.updateItem(building.ID, 'Condos', building.Condos[0].ID, 'newOccupantId');

    // Assert
    const updatedBuilding = await service.getBuilding(building.ID);
    expect(updatedBuilding.Condos[0].OccupantID).toEqual('newOccupantId');
    expect(updatedBuilding.Condos[0].Status).toEqual(CondoStatus.Owned); // Assuming CondoType is Sale

    // Clean up
    await service.deleteBuilding(building.ID);
  });

  it('should update item successfully with status updates for parkings', async () => {
    // Arrange
    await service.addBuilding(building);

    // Act
    await service.updateItem(building.ID, 'Parkings', building.Parkings[0].ID, 'newOccupantId');

    // Assert
    const updatedBuilding = await service.getBuilding(building.ID);
    expect(updatedBuilding.Parkings[0].OccupantID).toEqual('newOccupantId');
    expect(updatedBuilding.Parkings[0].Status).toEqual(ParkingLockerStatus.Unavailable);

    // Clean up
    await service.deleteBuilding(building.ID);
  });

  it('should update item successfully with status updates for lockers', async () => {
    // Arrange
    await service.addBuilding(building);

    // Act
    await service.updateItem(building.ID, 'Lockers', building.Lockers[0].ID, 'newOccupantId');

    // Assert
    const updatedBuilding = await service.getBuilding(building.ID);
    expect(updatedBuilding.Lockers[0].OccupantID).toEqual('newOccupantId');
    expect(updatedBuilding.Lockers[0].Status).toEqual(ParkingLockerStatus.Unavailable);

    // Clean up
    await service.deleteBuilding(building.ID);
  });

  it('should return an array of buildings', async () => {

    // Calling the function and expecting a result
    const result = await service.getAllBuildings();

    // Asserting that the result is an array of buildings
    expect(Array.isArray(result)).toBeTrue();
    expect(result.length).toBeGreaterThan(0);
    result.forEach((building: Building) => {
      expect(building.ID).toBeDefined();
      expect(building.Name).toBeDefined();
      expect(building.CompanyID).toBeDefined();
      expect(building.Address).toBeDefined();
    });

  });

  it('should return an array of buildings belonging to the specified company', async () => {
    const companyId = 'company123';

    // Calling the function and expecting a result
    const result = await service.getAllBuildingsOfCompany(companyId);

    // Asserting that the result contains only buildings belonging to the specified company
    expect(result.every(building => building.CompanyID === companyId)).toBeTrue();
  });
  
});