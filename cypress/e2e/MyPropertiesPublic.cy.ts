import { login } from './utils.cy';

// Acceptance test for the viewing My Properties as a public user
// User logs in
// User navigates towards My Properties section
// User clicks on testing building
// Checks that the condos, parkings and lockers are there

describe('Test MyProperties Page', () => {
  it('Navigate to MyProperties and check testing property and its condos, parking and lockers', () => {
    login('i_czubok@live.concordia.ca', 'soen390');

    cy.url().should('eq', 'http://localhost:4200/');

    // Click on the MyProperties button
    cy.wait(2000);
    
    // Click on the MyProperties button
    cy.get('.mat-toolbar.mat-toolbar-single-row').within(() => {
      // Click on the "My Properties" button
      cy.contains('My Properties').click();
    });
    cy.url().should('eq', 'http://localhost:4200/my-properties');

    /// Iterate through each building and find the one with the name "Fisher Complex"
    cy.get('.BuildingDiv').within(() => {
        cy.contains('.name', 'Fisher Complex')
          .parents('.card-content') // Navigate to the parent container of the building
          .within(() => {
            cy.get('#view_btn').click(); // Find and click the "View" button
          });
      });
  
      // Check url
      cy.url().should('include', 'http://localhost:4200/building-info');
  
      //Check overview tab
      cy.get('app-building-overview').should('be.visible');
      //cy.get('app-building-overview .sub-heading-content').eq(0).should('contain.text', 'Welcome to Fisher Complex');
  
      // Select the Condo tab and click on it
      cy.get('mat-tab-group')
        .should('be.visible')
        .within(() => {
          cy.contains('.mdc-tab__text-label', 'Condos').click();
        });
      // Verify if Condo tab content is visible
      cy.get('app-condo').should('be.visible');
      // Check if the specific condo is present
      //cy.contains('app-condo .location', '555 Montrose Dr., Beaconsfield').should(
      //  'exist'
      //);
  
      // Select the Lockers tab and click on it
      cy.get('mat-tab-group')
        .should('be.visible')
        .within(() => {
          cy.contains('.mdc-tab__text-label', 'Lockers').click();
        });
      // Verify if Lockers tab content is visible
      cy.get('app-locker').should('be.visible');
      // Check if the specific lockers is present
      // Check content in "Price per month" column for the first locker
      cy.contains('app-locker .lockerFee', '$65').should('exist');
  
      // Select the Parkings tab and click on it
      cy.get('mat-tab-group')
        .should('be.visible')
        .within(() => {
          cy.contains('.mdc-tab__text-label', 'Parking').click();
        });
      // Verify if Parking tab content is visible
      cy.get('app-parking-spot').should('be.visible');
      // Check content in "Fee" column for the first parking spot
      cy.get('app-parking-spot .parkingFee').eq(0).should('contain.text', '$95');
    });
  });
  