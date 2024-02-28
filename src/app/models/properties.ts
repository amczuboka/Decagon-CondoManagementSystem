export interface Building {
  ID: string;
  Year: number;
  CompanyID: string;
  Name: string;
  Bookings: Booking[];
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
  Type: CondoType;
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
  Status: ParkingLockerStatus;
  ParkingType: ParkingType;
  Fee: number;
}

export interface Locker {
  ID: string;
  OccupantID: string;
  Number: string;
  Status: ParkingLockerStatus;
  Size: LockerSize;
  Fee: number;
}

export enum CondoStatus {
  Vacant = 'Vacant',
  Owned = 'Owned',
  Rented = 'Rented',
}

export enum ParkingLockerStatus {
  Available = 'Available',
  Unavailable = 'Unavailable',
}

export enum LockerSize {
  size1 = '0.23m X 0.20m X 0.025m',
  size2 = '0.5m X 0.5m X 0.5m',
  size3 = '1m X 1m X 1m',
  size4 = '2m X 2m X 2m',
}

export enum CondoType {
  Sale = 'Sale',
  Rent = 'Rent',
}

export enum Facilities {
  Gym = 'Gym',
  Pool = 'Pool',
  Spa = 'Spa',
  Locker = 'Locker',
  Parking = 'Parking',
  Playground = 'Playground',
  MeetingRoom = 'Meeting Room',
}

export interface Booking {
  ID: string;
  Facility: Facilities;
  UserID: string;
  Date: Date;

export enum ParkingType {
  Standard = 'Standard',
  Handicap = 'Handicap',
}
