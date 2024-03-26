import { login } from './utils.cy';

// This script automates an acceptance test for viewing an Individual Condo page to ensure its functionalities are thoroughly tested.
// The test checks if essential elements such as features, descriptions, price details, and locations are visible.
// The test validates that the editing feature can be accessible and modified by an authorized company.

//Steps For public user:
// 1. User logs in
// 2. User directed to Home section
// 3. User clicks on testing buildings
// 4. Checks that the condos are there.
// 5. Clicks on a specific condo to view details of that condo.
// 6. Checks that the condo details are present there.

//Step For company user:
// 1. User logs in
// 2. User navigates to My Properties
// 3. User clicks on testing buildings
// 4. Checks that the condos are there.
// 5. Clicks on a specific condo to view details of that condo.
// 6. Checks that the condo details are present there.

//helper function to navigate to the building info page for a given building

function navigateToBuildingInfo(buildingName: string) {
  //Find and click on a specific building by iterating through the building elements
  cy.get('.BuildingDiv').within(() => {
    cy.contains('.name', buildingName)
      .parents('.card-content')
      .within(() => {
        cy.get('#view_btn').click(); // Click the "View" button
      });
  });

  // Check if the URL includes the expected path, indicating navigation to the building info page
  cy.url().should('include', 'http://localhost:4200/building-info');

  // Ensure the overview tab of the building info page is visible
  cy.get('app-building-overview').should('be.visible');
}

//helper function to click on a tab within the 'mat-tab-group' component

function clickOnTab(tabLabel: string) {
  // Click on the tab with the given label
  cy.get('mat-tab-group')
    .should('be.visible')
    .within(() => {
      cy.contains('.mdc-tab__text-label', tabLabel).click();
    });
}

//helper function to check individual condo details
function checkCondoDetails() {
  // Navigate to the 'Condos' tab
  clickOnTab('Condos');
  // Verify the content under the Condos tab is visible
  cy.get('app-condo').should('be.visible');

  // Within the condo listings, click on the first "View Details" button to navigate to an individual condo's page
  cy.get('app-condo').within(() => {
    cy.contains('View Details').first().click();
  });

  // Confirm navigation to the Individual Condo page by checking the URL
  cy.url().should('include', 'http://localhost:4200/individual-condo');

  // Perform visibility checks on essential elements of the Individual Condo page
  cy.get('.property-title').scrollIntoView().should('be.visible');
  cy.get('.property-address').scrollIntoView().should('be.visible');
  cy.get('.property-price').should('contain', 'CA');
  cy.get('.property-images img')
    .should('have.attr', 'src')
    .should('not.be.empty');
  cy.get('.icon-favorite').should('be.visible');
  cy.get('.icon-share').should('be.visible');
  cy.get('.icon-refresh').should('be.visible');
  cy.get('app-condo-features').scrollIntoView().should('be.visible');
  cy.get('app-description').scrollIntoView().should('be.visible');
  cy.get('app-location').scrollIntoView().should('be.visible');
  cy.get('.contact-section').scrollIntoView().should('be.visible');
}

// Define a test suite for individual condo page

describe('Test Individual Condo Page', () => {
  const buildingName = 'Villa Princess'; // Set the building name

  // Test case for public users
  it('Navigate to Individual Condo Page and check if features, description, price details, and locations are visible', () => {
    login('shawicarla@gmail.com', 'Karim1212.'); // Log in using predefined user credentials

    // Verify that the URL includes the expected path after login, ensuring the user is directed to the Home section
    cy.url().should('include', 'http://localhost:4200/');

    // Wait for 2 seconds to ensure the page and its components have fully loaded
    cy.wait(2000);

    // Navigate to the building info page
    navigateToBuildingInfo(buildingName);

    // Check the condo details
    checkCondoDetails();

    // Verify that the edit button is not visible to public users
    cy.get('.edit-button').should('not.exist');
  });

  // Test case for company users
  it('Navigate to Individual Condo Page, check details, and test editing', () => {
    login('tcsn321@gmail.com', 'Tcsn321'); // Log in using predefined user credentials

    // Verify that the URL includes the expected path after login, ensuring the user is directed to the Home section
    cy.url().should('include', 'http://localhost:4200/');

    // Wait for 2 seconds to ensure the page and its components have fully loaded
    cy.wait(2000);

    // Navigate to 'My Properties' page
    cy.get('.mat-toolbar.mat-toolbar-single-row').within(() => {
      cy.contains('My Properties').click();
    });

    // Ensure redirection to the My Properties page by verifying the URL
    cy.url().should('include', 'http://localhost:4200/my-properties');

    // Navigate to the building info page
    navigateToBuildingInfo(buildingName);

    // Check the condo details
    checkCondoDetails();

    // Check if the edit button is present in the DOM of an authorized company
    cy.get('body').then(($body) => {
      if ($body.find('.edit-button').length) {
        // If the edit button is found, click on it to initiate editing
        cy.get('.edit-button').click();
        // Simulate editing the condo details, for instance, changing the fee
        cy.get('[name="Fee"]').clear().type('5000'); // Set the fee to 5000
        // Save the changes
        cy.get('#save-button').click();
        // Ensure that the changes are successfully reflected
        cy.get('.property-price').should('contain.text', 'CA$5,000.00');
        // Confirm if the edit button remains visible after editing
        cy.get('.edit-button').should('exist');
      } else {
        // Handle the case where the edit button is not found or not visible
        cy.log('Edit button is not visible or not present.');
      }
    });
  });
});
