import { login } from './utils.cy';

// Acceptance test for the viewing available units
// User logs in
// User checks landing page for testing building
// User clicks on buidling
// Checks that the condos, parkings and lockers are there
describe('Test Available Properties Page', () => {
  it('Navigate to Landing and check testing property and its condos, parking and lockers', () => {
    login('i_czubok@live.concordia.ca', 'soen390');

    cy.url().should('include', 'http://localhost:4200/');

    // Iterate through each building and find the one with the name "Fisher Complex"
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
