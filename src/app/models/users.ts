import { Booking } from 'src/app/models/properties';
export interface User {
  uid: string;
  email: string;
  photoURL: string;
  emailVerified: boolean;
}

export interface UserDTO {
  FirstName: string;
  LastName: string;
  ID: string;
  Authority: Authority;
  Email: string;
  ProfilePicture: string;
  PhoneNumber: string;
  UserName: string;
  Notifications?: Notification[];
  Bookings?: Booking[];
}

export interface CompanyDTO extends UserDTO {
  FirstName: string;
  LastName: string;
  ID: string;
  Authority: Authority;
  Email: string;
  ProfilePicture: string;
  PhoneNumber: string;
  UserName: string;
  CompanyName: string;
  PropertyIds: string[];
  EmployeeIds: string[];
  Notifications?: Notification[];
}

export interface EmployeeDTO extends UserDTO {
  FirstName: string;
  LastName: string;
  ID: string;
  Authority: Authority;
  Email: string;
  ProfilePicture: string;
  CompanyName: string;
  PhoneNumber: string;
  UserName: string;
  PropertyIds: string[];
  Notifications?: Notification[];
  Role: Role;
}

export interface Notification {
  Message: string;
  New: boolean;
  Date: number;
  SenderId: string;
  SenderName: string;
  Type: NotificationType;
  Status?: RequestStatus;
}

export enum NotificationType {
  GeneralMessage = 'GeneralMessage',
  OwnershipRequest = 'OwnershipRequest',
  RentRequest = 'RentRequest',
  MaintenanceRequest = 'MaintenanceRequest',
  CleaningRequest = 'CleaningRequest',
  SecurityRequest = 'SecurityRequest',
  FinancialRequest = 'FinancialRequest',
}

export enum RequestStatus {
  Pending = 'Pending',
  Processing = 'Processing',
  Approved = 'Approved',
  Denied = 'Denied',
  Closed = 'Closed',
}

export enum Authority {
  Public = 'Public',
  Company = 'Company',
  Employee = 'Employee',
}

export enum Role {
  None = 'None',
  Manager = 'Manager',
  Financial = 'Financial',
  Maintenance = 'Maintenance',
  Cleaning = 'Cleaning',
  Security = 'Security',
}
