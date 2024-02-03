import { Injectable } from '@angular/core';
import {
  equalTo,
  get,
  getDatabase,
  orderByChild,
  query,
  ref,
} from 'firebase/database';
import { Authority, CompanyDTO, EmployeeDTO, UserDTO } from '../models/users';
import { Database, update } from '@angular/fire/database';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<any | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private database: Database) {}

  updateCurrentUser(user: any) {
    this.currentUserSubject.next(user);
  }

  async checkIfCompanyExists(companyName: string) {
    // Check if companies node exists
    const db = getDatabase();
    const companiesRef = ref(db, 'companies');
    const snapshot = await get(companiesRef);
    const companiesNodeExists = snapshot.exists();

    if (!companiesNodeExists) {
      return false;
    }

    // Check if company already exists
    const companiesQuery = query(
      companiesRef,
      orderByChild('CompanyName'),
      equalTo(companyName)
    );
    const companiesSnapshot = await get(companiesQuery);
    const existingCompany = companiesSnapshot.val();

    return existingCompany;
  }

  async getPublicUser(userId: string): Promise<UserDTO | null> {
    try {
      const db = getDatabase();
      const userRef = ref(db, `public users/${userId}`);
      const userSnapshot = await get(userRef);
      if (userSnapshot.exists()) {
        return userSnapshot.val() as UserDTO;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  }

  async getCompanyUser(userId: string): Promise<CompanyDTO | null> {
    try {
      const db = getDatabase();
      const userRef = ref(db, `companies/${userId}`);
      const userSnapshot = await get(userRef);
      if (userSnapshot.exists()) {
        return userSnapshot.val() as CompanyDTO;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  }

  async getEmployeeUser(userId: string): Promise<EmployeeDTO | null> {
    try {
      const db = getDatabase();
      const userRef = ref(db, `employees/${userId}`);
      const userSnapshot = await get(userRef);
      if (userSnapshot.exists()) {
        return userSnapshot.val() as EmployeeDTO;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  }

  async editUser(index: any, value: any) {
    try {
      if (value.Authority == Authority.Public) {
        let myUser = value as UserDTO;
        const dbRef = ref(this.database, `public users/${index}`); // Reference to the specific user in the public users node
        await update(dbRef, myUser);
      } else if (value.Authority == Authority.Company) {
        let myUser = value as CompanyDTO;
        const dbRef = ref(this.database, `companies/${index}`); // Reference to the specific user in the companies node
        await update(dbRef, myUser);
      } else {
        let myUser = value as EmployeeDTO;
        const dbRef = ref(this.database, `employees/${index}`); // Reference to the specific user in the employees node
        await update(dbRef, myUser);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
}
