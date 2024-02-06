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
  Notifications: string[];
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
  Notifications: string[];
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
  Notifications: string[];
  Role: Role;
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
