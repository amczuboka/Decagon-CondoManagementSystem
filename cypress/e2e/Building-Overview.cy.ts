/**
 * Sign in as company user
 * User goes to their properties page
 * User publishes a new property with a description
 * Sing out as company user
 * Sign in as public user
 * Click on newly created property property
 * Go to building-overview page of newly created property
 */

import { CondoType, ParkingType } from 'src/app/models/properties';
import { CompanyDTO } from 'src/app/models/users';
import { addCondo, addLocker, addParking, login } from './utils.cy';

//Company user logs in and sees properties
describe('Company user logs in and sees properties', () => {
  beforeEach(() => {
    login('rosef12997@hisotyr.com', '123456');
    cy.url().should('eq', 'http://localhost:4200/');
  });

  it('Goes to my properties page', () => {
    cy.get('.mat-toolbar.mat-toolbar-single-row').within(() => {
      cy.wait(1000);
      cy.contains('My Properties').click();
      cy.wait(1000);
    });
  })
})  //end of first describe

//Company user logs in and creates new property
describe('Company user logs in and creates new property', () => {
  beforeEach(() => {
    login('rosef12997@hisotyr.com', '123456');
    cy.url().should('eq', 'http://localhost:4200/');
    cy.visit('/add-new-property');
  });

  it('Company creates new property', async () => {
    cy.get('input[name="Name"]').type('Cypress Test 116');
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
    cy.window().then(async (win) => {
      const currentUser = (win as any).authService.getUser();
      const user = (await (win as any).userService.getCompanyUser(
        currentUser.uid
      )) as CompanyDTO;
      console.log('the user', user);
      const promiseDelete = user.PropertyIds.map(async (ID) => {
        await(win as any).buildingService.deleteBuilding(ID);
      });
      await Promise.all(promiseDelete);
    });
  });
});
