export interface Building {
  ID: string;
  Year: number;
  CompanyID: string;
  Name: string;
  Address: string;
  Bookings: Booking[];
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
  Height: string;
  Width: string;
  Length: string;
  Fee: number;
}

export interface BudgetReport{
  Profit?: number;
  BuildingName: string;  
  CondoFeeRevenue: number;
  OperationCosts: number;
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
  OccupantID: string;
  Facility: Facilities;
  Date: number;
  TimeSlot: TimeSlots; 
}

export enum ParkingType {
  Standard = 'Standard',
  Handicap = 'Handicap',
}

export enum sourcePage {
  availablePage = "availablePage",
  propertiesPage = "propertiesPage"
};

export enum TimeSlots {
  NineAM = "9:00 am",
  TenAM = "10:00 am",
  ElevenAM = "11:00 am",
  TwelvePM = "12:00 pm",
  OnePM = "1:00 pm",
  TwoPM = "2:00 pm",
  ThreePM = "3:00 pm",
  FourPM = "4:00 pm"
}