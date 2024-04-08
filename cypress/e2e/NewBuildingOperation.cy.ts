import { login } from './utils.cy';

// Acceptance test for the adding a new operation to a building
// User logs in
// User navigates towards add new operation page
// User inputs new operation
// User deletes new operation to make sure test is re runnable
describe('Test MyProperties Page', () => {
  it('Navigate to MyProperties and check testing property and its condos, parking and lockers', () => {
    login('i_czubok@live.concordia.ca', 'soen390');

    cy.url().should('include', 'http://localhost:4200/');

    // Wait
    cy.wait(2000);

    // Click on the MyProperties button
    cy.get('.mat-toolbar.mat-toolbar-single-row').within(() => {
      // Click on the "My Properties" button
      cy.contains('Add New Operation').click();
    });

    // After clicking on the button, assert the URL
    cy.url().should(
      'include',
      'http://localhost:4200/add-new-building-operation'
    );

    // Make sure inputs exists
    cy.get('form').should('exist');
    cy.get('input[formControlName="operationName"]').should('exist');
    cy.get('input[formControlName="description"]').should('exist');
    cy.get('input[formControlName="cost"]').should('exist');
    cy.get('mat-select[formControlName="building"]').should('exist');

    it('should display error messages for required fields', () => {
      cy.get('button[type="submit"]').click();
      cy.wait(3000);
      cy.get('.alert-snackbar').should('be.visible');
    });

    // Click on the submit button
    cy.get('button[type="submit"]').click();
    cy.wait(2000);
    // Check if the alert Snackbar is visible
    cy.get('.error').should('be.visible');

    // Input values into form fields
    cy.get('input[formControlName="operationName"]')
      .should('exist')
      .type('Clean Gutters');
      cy.wait(2000);
    cy.get('input[formControlName="description"]')
      .should('exist')
      .type(
        'This operation is done once a year. The service clean all the gutters on our building. This prevent clogging when it rains the following year.'
      );
    cy.get('input[formControlName="cost"]').should('exist').type('750.00');

    cy.get('mat-select[formControlName="building"]').click(); // Click to open the dropdown

    cy.wait(2000);

    // Wait for the dropdown options to appear
    cy.get('mat-option')
      .should('have.length.gt', 0)
      .then(() => {
        // Find the option containing the desired text and click on it
        cy.contains('mat-option', 'Building Fisher Complex').click();

        // Click submit button
        cy.get('button[type="submit"]').click();
        cy.wait(2000);
      });

    //Delete building operation
    cy.window().then(async (win) => {
      await (win as any).buildingService.deleteOperationByName(
        'gc2c37wrny1712213167948',
        'Clean Gutters'
      );
    });
  });
});
