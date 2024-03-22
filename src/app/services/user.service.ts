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
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private myUserSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  myUser = this.myUserSubject.asObservable();

  constructor(private database: Database, private authService: AuthService) {
    this.getUser();
  }

  /**
   * Updates and broadcasts the current user's information.
   *
   * @param {UserDTO | EmployeeDTO | CompanyDTO | null} user - The updated user data.
   */
  updateUser(user: UserDTO | EmployeeDTO | CompanyDTO | null) {
    this.myUserSubject.next(user);
  }

  /**
   * Retrieves and updates the current user's information based on their authority level.
   *
   * @returns A Promise that resolves when the user's information has been updated.
   */
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

  /**
   * Checks if a company with the given name already exists in the database.
   *
   * @param {string} companyName - The name of the company to check.
   * @returns A Promise that resolves to a boolean indicating whether the company exists.
   */
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

  /**
   * Retrieves a public user's data from the database.
   *
   * @param {string} userId - The ID of the user to retrieve.
   * @returns A Promise that resolves to the user's data as a `UserDTO` object, or `null` if the user does not exist.
   */
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

  /**
   * Retrieves a company user's data from the database.
   *
   * @param {string} userId - The ID of the user to retrieve.
   * @returns A Promise that resolves to the user's data as a `CompanyDTO` object, or `null` if the user does not exist.
   */
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

  /**
   * Retrieves an employee user's data from the database.
   *
   * @param {string} userId - The ID of the user to retrieve.
   * @returns A Promise that resolves to the user's data as an `EmployeeDTO` object, or `null` if the user does not exist.
   */
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

  /**
   * Updates a user's data in the database based on their authority level.
   *
   * @param {any} index - The ID of the user to update.
   * @param {any} value - The new data for the user.
   * @throws Will throw an error if the update operation fails.
   */
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

  /**
   * Deletes a user from the database based on their authority level.
   *
   * @param {any} User - The user object to delete.
   * @throws Will throw an error if the deletion operation fails.
   */
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

  /**
   * Subscribes to updates for a public user in the database.
   *
   * @param {string} userId - The ID of the user to subscribe to.
   * @param {function} callback - The function to call when the user's data updates.
   */
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

  /**
   * Subscribes to updates for a company user in the database.
   *
   * @param {string} userId - The ID of the user to subscribe to.
   * @param {function} callback - The function to call when the user's data updates.
   */
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

  /**
   * Subscribes to updates for an employee user in the database.
   *
   * @param {string} userId - The ID of the user to subscribe to.
   * @param {function} callback - The function to call when the user's data updates.
   */
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

  /**
   * Sends a notification to a specific user.
   *
   * @param {string} userId - The ID of the user to send the notification to.
   * @param {Notification} notification - The notification to send.
   * @throws Will throw an error if the notification sending operation fails.
   */
  async sendNotificationToUser(userId: string, authority: Authority, notification: Notification) {
    try {
      const db = getDatabase();
      let userRef = null;
      if (authority == Authority.Public) {
        userRef = ref(db, `public users/${userId}/Notifications`);
      } else if (authority == Authority.Company) {
        userRef = ref(db, `companies/${userId}/Notifications`);
      } else {
        userRef = ref(db, `employees/${userId}/Notifications`);
      }
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

  async classifyUser(userId: string): Promise<string | null> {
    try {
      // Check if the user is a public user
      const publicUser = await this.getPublicUser(userId);
      if (publicUser) {
        return 'public';
      }

      // Check if the user is a company user
      const companyUser = await this.getCompanyUser(userId);
      if (companyUser) {
        return 'company';
      }

      // Check if the user is an employee user
      const employeeUser = await this.getEmployeeUser(userId);
      if (employeeUser) {
        return 'employee';
      }

      return null; // If user not found
    } catch (error) {
      console.error('Error classifying user:', error);
      throw error;
    }
  }

  async getEmployeesOfCompany(companyName: string): Promise<EmployeeDTO[] | null> {
    try {
      const db = getDatabase();
      const employeesRef = ref(db, 'employees');
      const employeesSnapshot = await get(employeesRef);

      const employees: EmployeeDTO[] = [];
      if (employeesSnapshot.exists()) {
        employeesSnapshot.forEach((employeeSnap) => {
          const employee = employeeSnap.val() as EmployeeDTO;
          if (employee.CompanyName == companyName) {
            employees.push(employee);
          }
        });
        return employees;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting employees of company:', error);
      throw error;
    }
  }

  async updateEmployee(employee: EmployeeDTO) {
    try {
      const db = getDatabase();
      const employeeRef = ref(db, `employees/${employee.ID}`);
      await update(employeeRef, employee);
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
    }
  }

  async deleteEmployee(employeeId: string) {
    try {
      const db = getDatabase();
      const employeeRef = ref(db, `employees/${employeeId}`);
      await remove(employeeRef);
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw error;
    }
  }
}
