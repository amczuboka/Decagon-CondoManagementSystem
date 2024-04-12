import { CompanyDTO } from 'src/app/models/users';
import { CondoType, ParkingType } from './../../src/app/models/properties';
import { firebaseConfig } from 'src/environments/environment';
export const login = (email: string, password: string) => {
  cy.intercept(
    'POST',
    'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
      firebaseConfig.apiKey
  ).as('apiCall');
  cy.visit('/login');
  cy.get('input[formControlName="Email"]').type(email);
  cy.get('input[formControlName="Password"]').type(password);
  cy.get('.pt-1').find('.btn').click({ force: true });
  cy.wait('@apiCall');
};
export const addCondo = (Type: CondoType) => {
  cy.get('.button_setup').contains('Add Condo').click();
  cy.get('input[name="Quantity"]').type('10');
  cy.get('input[name="UnitNumber"]').type('1A', { force: true });
  cy.get('input[name="SquareFootage"]').type('1000');
  cy.get('input[name="NumberOfBedrooms"]').type('2', { force: true });
  cy.get('input[name="NumberOfBathrooms"]').type('1', { force: true });
  cy.get('mat-select[name="Type"]').click();
  if (Type === CondoType.Rent) cy.get('mat-option').contains('Rent').click();
  else if (Type === CondoType.Sale)
    cy.get('mat-option').contains('Sale').click();
  cy.get('input[name="Fee"]').type('1000');
  cy.get('#CondoDescription').type('This is a description');
  cy.wait(2000);
  cy.get('#CondoPicture').selectFile('./cypress/e2e/default.png');
  cy.wait(2000);
  cy.get('button').contains('Save').click();
  cy.wait(2000);
};

export const addLocker = () => {
  cy.get('.button_setup').contains('Add Locker').click();
  cy.get('input[name="Quantity"]').type('10');
  cy.get('input[name="Number"]').type('1A', { force: true });
  cy.get('input[name="Height"]').type('1000');
  cy.get('mat-select[name="HeightUnit"]').click();
  cy.get('mat-option').contains('cm').click();
  cy.get('input[name="Width"]').type('1000');
  cy.get('mat-select[name="WidthUnit"]').click();
  cy.get('mat-option').contains('cm').click();
  cy.get('input[name="Length"]').type('1000');
  cy.get('mat-select[name="LengthUnit"]').click();
  cy.get('mat-option').contains('cm').click();
  cy.get('input[name="Fee"]').type('1000');
  cy.wait(2000);
  cy.get('button').contains('Save').click();
  cy.wait(2000);
};

export const addParking = (Type: ParkingType) => {
  cy.get('.button_setup').contains('Add Parking').click();
  cy.get('input[name="Quantity"]').type('10');
  cy.get('input[name="Number"]').type('1A', { force: true });
  cy.get('mat-select[name="ParkingType"]').click();
  if (Type === ParkingType.Standard)
    cy.get('mat-option').contains('Standard').click();
  else if (Type === ParkingType.Handicap)
    cy.get('mat-option').contains('Handicap').click();
  cy.get('input[name="Fee"]').type('100', { force: true });
  cy.wait(2000);
  cy.get('button').contains('Save').click();
  cy.wait(2000);
};

export const CreateProperty = () => {
  cy.visit('/add-new-property');
  cy.get('input[name="Name"]').type('Sample Building');
  cy.get('input[name="Country"]').type('Sample Country');
  cy.get('input[name="State"]').type('Sample State');
  cy.get('input[name="City"]').type('Sample City');
  cy.get('input[formControlName="StreetNN"]').type('Sample Street', {
    force: true,
  });
  cy.get('input[name="ZipCode"]').type('H6J 7K8');
  cy.get('input[name="Year"]').type('2022');
  cy.get('textarea[name="Description"]').type('Sample Description');
  cy.get('input[name="Picture"]').selectFile('./cypress/e2e/TEST.png');
  cy.get('mat-checkbox[value="Gym"]').click();
  cy.get('mat-checkbox[value="Pool"]').click();
  cy.get('mat-checkbox[value="Spa"]').click();
  cy.get('mat-checkbox[value="Playground"]').click();
  cy.get('mat-checkbox[value="Meeting Room"]').click();
  addCondo(CondoType.Rent);
  addCondo(CondoType.Sale);
  addLocker();
  addParking(ParkingType.Standard);
  addParking(ParkingType.Handicap);
  cy.get('button[type="submit"]').click();
  cy.get('.loading-indicator').should('exist');
  cy.wait(5000);
};

export const DeleteProperty = () => {
  cy.wait(2000);
  cy.window().then(async (win) => {
    const currentUser = (win as any).authService.getUser();
    const user = (await (win as any).userService.getCompanyUser(
      currentUser.uid
    )) as CompanyDTO;
    console.log('the user', user);
    const promiseDelete = user.PropertyIds.map(async (ID) => {
      await (win as any).buildingService.deleteBuilding(ID);
    });
    await Promise.all(promiseDelete);
  });
};
