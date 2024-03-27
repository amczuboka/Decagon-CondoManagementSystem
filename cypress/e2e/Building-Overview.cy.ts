/**
 * Company user logs in
 * Company sser publishes a new property with a description 
 * Sign in as public user
 * Public user clicks on new property
 * Public user navigates to building-overview tab
 * Company user logs in
 * Company user deleted newly created property
 */


import { CondoType, ParkingType } from 'src/app/models/properties';	
import { CompanyDTO } from 'src/app/models/users';	
import { addCondo, addLocker, addParking, login } from './utils.cy';	


//Company logs in a creates new property
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

  it('Company creates new property',() => {
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
    cy.wait(2000);
    cy.get('input[name="Picture"]').selectFile('./cypress/e2e/TEST.png');
    cy.get('mat-checkbox[value="Gym"]').click();
    cy.get('mat-checkbox[value="Pool"]').click();
    cy.get('mat-checkbox[value="Spa"]').click();
    cy.get('mat-checkbox[value="Playground"]').click();
    cy.get('mat-checkbox[value="Meeting Room"]').click();
    cy.wait(1000);
    addCondo(CondoType.Sale);

    //trying smt
    // const addCondo = (Type: CondoType) => {
    // cy.get('.button_setup').contains('Add Condo').click();                                             
    // cy.get('input[name="Quantity"]').type('10');
    // cy.get('input[name="UnitNumber"]').type('1A', { force: true });
    // cy.get('input[name="SquareFootage"]').type('1000');
    // cy.get('button[type="submit"]').click();
    // }
    //trying smt

    cy.wait(1000);
    addLocker();
    cy.wait(1000);
    // addParking(ParkingType.Standard);
    // cy.wait(1000);
    addParking(ParkingType.Handicap);
    cy.get('button[type="submit"]').click();
    cy.get('.loading-indicator').should('exist');
    cy.wait(5000);
  });
});

//Company logs in and deletes newly created property
describe('Company user logs in and deletes property', () => {
  beforeEach(() => {	  
    login('rosef12997@hisotyr.com', '123456');
    cy.wait(5000);
    cy.url().should('eq', 'http://localhost:4200/');
  });	  

  it('Deletes newly created property', () => {
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
  })
})  //end of first describe