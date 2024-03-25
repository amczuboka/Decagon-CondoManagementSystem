import { login } from './utils.cy';

// This script automates an acceptance test for viewing an Individual Condo page as a public user.
// The test checks if essential elements such as features, descriptions, price details, and locations are visible.

//Steps:
// 1. User logs in
// 2. User directed to Home section
// 3. User clicks on testing buildings
// 4. Checks that the condos are there.
// 5. Clicks on a specific condo to view details of that condo.
// 6. Checks that the condo details are present there.

describe('Test Individual Condo Page', () => {
  it('Navigate to Individual Condo Page and check if features, description, price details, and locations are visible', () => {
    login('shawicarla@gmail.com', 'Karim1212.'); // Log in using predefined user credentials

    // Verify that the URL includes the expected path after login, ensuring the user is directed to the Home section
    cy.url().should('include', 'http://localhost:4200/');

    // Wait for 2 seconds to ensure the page and its components have fully loaded
    cy.wait(2000);

    // Find and click on a specific building named "Villa Princess" by iterating through the building elements
    cy.get('.BuildingDiv').within(() => {
      cy.contains('.name', 'Villa Princess')
        .parents('.card-content')
        .within(() => {
          cy.get('#view_btn').click(); // Find and click the "View" button
        });
    });

    // Check if the URL includes the expected path, indicating navigation to the building info page
    cy.url().should('include', 'http://localhost:4200/building-info');

    // Ensure the overview tab of the building info page is visible
    cy.get('app-building-overview').should('be.visible');

    // Select and click on the "Condos" tab to view condos within the building
    cy.get('mat-tab-group')
      .should('be.visible')
      .within(() => {
        cy.contains('.mdc-tab__text-label', 'Condos').click();
      });

    // Verify the content under the Condos tab is visible
    cy.get('app-condo').should('be.visible');

    // Within the condo listings, click on the first "View Details" button to navigate to an individual condo's page
    cy.get('app-condo').within(() => {
      cy.contains('View Details').first().click();
    });
    // Confirm navigation to the Individual Condo page by checking the URL
    cy.url().should('include', 'http://localhost:4200/individual-condo');

    // Perform visibility checks on essential elements of the Individual Condo page
    cy.get('.property-title').scrollIntoView().should('be.visible'); // Checks for the visibility of the property title
    cy.get('.property-address').scrollIntoView().should('be.visible'); // Checks for the visibility of the property address
    cy.get('.property-price').should('contain', 'CA'); // Checks that the property price is displayed in Canadian dollars
    cy.get('.property-images img')
      .should('have.attr', 'src')
      .should('not.be.empty'); // Verifies that property images are loaded

    // Verify that the edit button is not visible to public users
    cy.get('.edit-button').should('not.exist');

    // Confirm that action icons (favorite, share, refresh) are visible to the user
    cy.get('.icon-favorite').should('be.visible');
    cy.get('.icon-share').should('be.visible');
    cy.get('.icon-refresh').should('be.visible');

    // Scroll to and check the visibility of additional property details: features, description, and location
    cy.get('app-condo-features').scrollIntoView().should('be.visible');
    cy.get('app-description').scrollIntoView().should('be.visible');
    cy.get('app-location').scrollIntoView().should('be.visible');

    // Ensure the contact section at the bottom of the page is also visible
    cy.get('.contact-section').scrollIntoView().should('be.visible');
  });
});
