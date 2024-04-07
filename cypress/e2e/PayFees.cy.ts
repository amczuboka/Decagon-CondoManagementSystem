import { login } from './utils.cy';

// Acceptance test for paying property fees as a public user
// User logs in
// User navigates towards a condo
// User clicks on pay fees
// User fills in info on payment page
// User renavigates towards payment page, and checks that there is 0$ balance
// Deletes fees in database, so test passes every time

describe('Test Condo fees page', () => {
  it('Navigate to payment page and ', () => {
    login('vemiji5713@bitofee.com', '123456');

    cy.url().should('include', 'http://localhost:4200/');

    // Click on the MyProperties button
    cy.wait(2000);

    // Click on the MyProperties button
    cy.get('.mat-toolbar.mat-toolbar-single-row').within(() => {
      // Click on the "My Properties" button
      cy.contains('My Properties').click();
    });
    cy.url().should('include', 'http://localhost:4200/my-properties');

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

    // Select the Condo tab and click on it
    cy.get('mat-tab-group')
      .should('be.visible')
      .within(() => {
        cy.contains('.mdc-tab__text-label', 'Condos').click();
      });

    // Get the 1A-0-0 condo and see its details
    cy.get('.body') // Assuming this class is unique for the container holding condo items
      .contains('.name', '1A-0-0') // Find the condo with the specified name
      .parents('.item') // Navigate to the parent container of the condo item
      .within(() => {
        cy.get('.buttonItem').click(); // Find and click the "View Details" button
      });

    // Click on pay fees
    cy.get('.payment-button').click();

    // Verify input fields exist
    cy.get('form').should('exist');
    cy.get('input[name="Name"]').should('exist');
    cy.get('input[name="Email"]').should('exist');
    cy.get('input[name="Phone"]').should('exist');
    cy.get('input[name="Amount"]').should('exist');
    cy.get('input[name="Cardholder"]').should('exist');
    cy.get('input[name="CardNumber"]').should('exist');
    cy.get('input[name="ExpiryDate"]').should('exist');
    cy.get('input[name="CVV"]').should('exist');

    // Make sure errors appear
    cy.get('.rounded-button').click();
    cy.contains('Please fill out all required fields').should('be.visible');


    // Fil the input fields
    cy.get('input[name="Name"]').type('Nicko Pipo');
    cy.get('input[name="Email"]').type('vemiji5713@bitofee.com');
    cy.get('input[name="Phone"]').type('438-666-7777');
    cy.get('input[name="Amount"]').type('252.25');
    cy.get('input[name="Cardholder"]').type('Nicko Pipo');
    cy.get('input[name="CardNumber"]').type('1234567891011121');
    cy.get('input[name="ExpiryDate"]').focus(); 

    cy.get('input[name="ExpiryDate"]').type('12/26');
    
    cy.get('input[name="CVV"]').focus();
    cy.get('input[name="CVV"]').type('123');

     // Assert that the remaining balance is $200
     cy.contains('.diff', 'Remaining Balance: 0');

    // Click on the submit button
cy.get('.rounded-button').click();

cy.wait(3000);

// Click the "Home" button
cy.get('mat-toolbar .otherLinks') // Locate the parent div containing the header links
  .contains('a.nav-link', 'Home') // Find the "Home" button within it
  .click();

   // Renavigate to payment page 
    // Click on the MyProperties button
    cy.get('.mat-toolbar.mat-toolbar-single-row').within(() => {
        // Click on the "My Properties" button
        cy.contains('My Properties').click();
      });
      cy.url().should('include', 'http://localhost:4200/my-properties');
  
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
  
      // Select the Condo tab and click on it
      cy.get('mat-tab-group')
        .should('be.visible')
        .within(() => {
          cy.contains('.mdc-tab__text-label', 'Condos').click();
        });
  
      // Get the 1A-0-0 condo and see its details
      cy.get('.body') // Assuming this class is unique for the container holding condo items
        .contains('.name', '1A-0-0') // Find the condo with the specified name
        .parents('.item') // Navigate to the parent container of the condo item
        .within(() => {
          cy.get('.buttonItem').click(); // Find and click the "View Details" button
        });
  
      // Click on pay fees
      cy.get('.payment-button').click();

       // Assert that the remaining balance is $200
    cy.contains('.diff', 'Remaining Balance: 0');

    // Delete Condo fee from this condo to make sure test always passes
    

  });
});
