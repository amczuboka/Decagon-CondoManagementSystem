export interface Building {
    ID: string;
    Year: number;
    CompanyID: string;
    Name: string;
    UnitCount: number;
    ParkingCount: number;
    LockerCount: number;
    Address: string;
    Description: string;
    Parkings: ParkingSpot[];
    Lockers: Locker[];
    Condos: Condo[];
    Picture: string;
    Facilities: Facilities[];
}

export interface Condo {
    ID: string; 
    OccupantID: string;
    UnitNumber: string;
    Fee: number;
    Picture: string;
    Description: string;
    NumberOfBedrooms: number;
    NumberOfBathrooms: number;
    Status: CondoStatus;
    SquareFootage: number;
}

export interface ParkingSpot {
    ID: string;
    OccupantID: string;
    Number: string;
    Fee: number;
}

export interface Locker {
    ID: string;
    OccupantID: string;
    Number: string;
    Fee: number;
}

export enum CondoStatus {
  Vacant = 'Vacant',
  Owned = 'Owned',
  Rented = 'Rented',
}

export enum Facilities {
    Gym = 'Gym',
    Pool = 'Pool',
    Spa = 'Spa',
    Locker = 'Locker',
    Parking = 'Parking',
    Concierge = 'Concierge',
    Playground = 'Playground',
    MeetingRoom = 'Meeting Room',
} 