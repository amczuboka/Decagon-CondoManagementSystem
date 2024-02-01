import { Injectable } from '@angular/core';
import { equalTo, get, getDatabase, orderByChild, query, ref } from 'firebase/database';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor() {}

  // TODO: Add methods to get user data from realtime database. Base off of Hexagon.

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

}
