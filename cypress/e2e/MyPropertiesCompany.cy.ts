import { login } from './utils.cy';

// Acceptance test for the viewing My Properties as a company
// User logs in
// User navigates towards My Properties section
// User clicks on testing building
// Checks that the condos, parkings and lockers are there

describe('Test MyProperties Page', () => {
  it('Navigate to MyProperties and check testing property and its condos, parking and lockers', () => {
    login('i_czubok@live.concordia.ca', 'soen390');

    cy.url().should('include', 'http://localhost:4200/');

    cy.wait(2000);

    // Click on the MyProperties button
    cy.get('.mat-toolbar.mat-toolbar-single-row').within(() => {
      // Click on the "My Properties" button
      cy.contains('My Properties').click();
    });

    // After clicking on the button, assert the URL
    cy.url().should('include', 'http://localhost:4200/my-properties');

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

    // Select the Condo tab and click on it
    cy.get('mat-tab-group')
      .should('be.visible')
      .within(() => {
        cy.contains('.mdc-tab__text-label', 'Condos').click();
      });
    // Verify if Condo tab content is visible
    cy.get('app-condo').should('be.visible');

    // Select the Lockers tab and click on it
    cy.get('mat-tab-group')
      .should('be.visible')
      .within(() => {
        cy.contains('.mdc-tab__text-label', 'Lockers').click();
      });

    // Wait for page to load
    cy.wait(4000);
    // Verify if Lockers tab content is visible
    cy.get('app-locker').should('be.visible');
    // Check if the specific lockers is present
    // Check content in "Price per month" column for the first locker
    // Use Cypress to select the specific table cell
    cy.get(
      '.mat-mdc-cell.mdc-data-table__cell.cdk-cell.cdk-column-Price-per-month.mat-column-Price-per-month.ng-star-inserted'
    )
      .first() // Select only the first matching element
      .invoke('text')
      .then((text) => {
        // Assert that the text contains '$65'
        expect(text.trim()).to.eq('$65');
      });

    // Select the Parkings tab and click on it
    cy.get('mat-tab-group')
      .should('be.visible')
      .within(() => {
        cy.contains('.mdc-tab__text-label', 'Parking').click();
      });
    // Wait for page to load
    cy.wait(4000);
    // Verify if Parking tab content is visible
    cy.get('app-parking-spot').should('be.visible');
    // Check content in "Fee" column for the first parking spot
    cy.get(
      '.mat-mdc-cell.mdc-data-table__cell.cdk-cell.cdk-column-Fee.mat-column-Fee.ng-star-inserted'
    )
      .first() // Select only the first matching element
      .invoke('text')
      .then((text) => {
        // Assert that the text contains '$65'
        expect(text.trim()).to.eq('$95');
      });
  });
});
