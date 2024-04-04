/**
 * Company user logs in
 * Company user publishes a new property with a description 
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
describe('Company user logs in', () => {
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

  it('Creates new property',() => {
    cy.visit('/add-new-property');
    cy.wait(5000);
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
    addCondo(CondoType.Sale);
    addLocker();
    addParking(ParkingType.Handicap);
    cy.get('button[type="submit"]').click();
    cy.get('.loading-indicator').should('exist');
    cy.wait(5000);
  });

})  //end of first describe


//Company logs in and deletes newly created property
describe('Public user logs in', () => {
  beforeEach(() => {	  
    login('karinasd07@hotmail.com', 'public_pass');
    cy.wait(5000);
    cy.url().should('eq', 'http://localhost:4200/');
  });	  

  it('Views newly created property', () => {
    cy.get('.BuildingDiv').within(() => {
      cy.contains('.name', 'Cypress Test 116')
        .parents('.card-content') 
        .within(() => {
          cy.get('#view_btn').click(); 
        });
    });
    cy.wait(2000);
    cy.get('#building-title-pic').scrollIntoView().should('be.visible');
    cy.get('#description').scrollIntoView().should('be.visible');
    cy.get('#general-info').scrollIntoView().should('be.visible');
    cy.get('#facilities').scrollIntoView().should('be.visible');
    cy.get('#company-info').scrollIntoView().should('be.visible');
  })

}) 

//Company logs in and deletes newly created property
describe('Company user logs in again', () => {
  beforeEach(() => {	  
    login('rosef12997@hisotyr.com', '123456');
    cy.wait(5000);
    cy.url().should('eq', 'http://localhost:4200/');
  });	  

  it('Deletes newly created property', async () => {
    cy.wait(2000);
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
}) 