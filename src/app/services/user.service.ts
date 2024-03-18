import { Injectable } from '@angular/core';
import {
  DatabaseReference,
  equalTo,
  get,
  getDatabase,
  orderByChild,
  query,
  ref,
  onValue,
} from 'firebase/database';
import {
  Authority,
  CompanyDTO,
  EmployeeDTO,
  Notification,
  User,
  UserDTO,
} from '../models/users';
import { Database, remove, set, update } from '@angular/fire/database';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private myUserSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  myUser = this.myUserSubject.asObservable();

  constructor(private database: Database, private authService: AuthService) {
    this.getUser();
  }

  updateUser(user: UserDTO | EmployeeDTO | CompanyDTO | null) {
    this.myUserSubject.next(user);
  }

  getUser() {
    return new Promise<void>((resolve) => {
      let myUser = this.authService.getUser() as User;
      if (this.myUser) {
        const callback = (user: any) => {
          this.myUser = user;
          resolve();
        };

        if (myUser && myUser.photoURL == Authority.Company) {
          this.subscribeToCompanyUser(myUser.uid, callback);
        } else if (myUser && myUser.photoURL == Authority.Employee) {
          this.subscribeToEmployeeUser(myUser.uid, callback);
        } else if (myUser) {
          this.subscribeToPublicUser(myUser.uid, callback);
        }
      } else {
        resolve();
      }
    });
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

    if (existingCompany) {
      return true;
    } else {
      return false;
    }
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

  async deleteUser(User: any) {
    try {
      if (User.Authority == Authority.Public) {
        const dbRef: DatabaseReference = ref(
          this.database,
          `public users/${User.ID}`
        );
        await remove(dbRef);
      } else if (User.Authority == Authority.Company) {
        const dbRef: DatabaseReference = ref(
          this.database,
          `companies/${User.ID}`
        );
        await remove(dbRef);
      } else {
        const dbRef: DatabaseReference = ref(
          this.database,
          `employees/${User.ID}`
        );
        await remove(dbRef);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  async subscribeToPublicUser(
    userId: string,
    callback: (user: UserDTO | null) => void
  ) {
    const db = getDatabase();
    const userRef = ref(db, `public users/${userId}`);
    onValue(
      userRef,
      (snapshot) => {
        if (snapshot.exists()) {
          this.updateUser(snapshot.val() as UserDTO);
          callback(snapshot.val() as UserDTO);
        } else {
          callback(null);
        }
      },
      {
        onlyOnce: false,
      }
    );
  }

  async subscribeToCompanyUser(
    userId: string,
    callback: (user: CompanyDTO | null) => void
  ) {
    const db = getDatabase();
    const userRef = ref(db, `companies/${userId}`);
    onValue(
      userRef,
      (snapshot) => {
        if (snapshot.exists()) {
          this.updateUser(snapshot.val() as CompanyDTO);
          callback(snapshot.val() as CompanyDTO);
        } else {
          callback(null);
        }
      },
      {
        onlyOnce: false,
      }
    );
  }

  async subscribeToEmployeeUser(
    userId: string,
    callback: (user: EmployeeDTO | null) => void
  ) {
    const db = getDatabase();
    const userRef = ref(db, `employees/${userId}`);
    onValue(
      userRef,
      (snapshot) => {
        if (snapshot.exists()) {
          this.updateUser(snapshot.val() as EmployeeDTO);
          callback(snapshot.val() as EmployeeDTO);
        } else {
          callback(null);
        }
      },
      {
        onlyOnce: false,
      }
    );
  }

  async sendNotificationToUser(userId: string, notification: Notification) {
    try {
      const db = getDatabase();
      const userRef = ref(db, `public users/${userId}/Notifications`);
      const userSnapshot = await get(userRef);
      if (userSnapshot.exists()) {
        const notifications = userSnapshot.val();
        notifications.push(notification);
        await set(userRef, notifications);
      } else {
        await set(userRef, [notification]);
      }
    } catch (error) {
      throw error;
    }
  }

  
}
