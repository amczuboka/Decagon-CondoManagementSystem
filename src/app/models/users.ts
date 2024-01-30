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

export enum Authority {
    Public = 'Public',
    Individual = 'Individual',
    Company = 'Company',
    Employee = 'Employee',
    CondoOwner = 'CondoOwner',
    RentalUser = 'RentalUser',
}