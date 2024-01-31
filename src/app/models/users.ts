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
}

export interface CompanyDTO extends UserDTO {
  FirstName: string;
  LastName: string;
  ID: string;
  Authority: Authority;
  Email: string;
  ProfilePicture: string;
  CompanyName: string;
  PropertyIds: string[];
  EmployeeIds: string[];
}

export interface EmployeeDTO extends UserDTO {
  FirstName: string;
  LastName: string;
  ID: string;
  Authority: Authority;
  Email: string;
  ProfilePicture: string;
  CompanyName: string;
  PropertyIds: string[];
}

export enum Authority {
    Public = 'Public',
    Company = 'Company',
    Employee = 'Employee',
}