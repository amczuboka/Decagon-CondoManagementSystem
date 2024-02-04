import {
  login
} from './utils.cy'

// Acceptance test for the profile page
// User logs in
// User navigates to the profile page
// User changes their data
// Checks that the data has been updated after refreshing the page

describe('Test Profile Page', () => {
  it('Navigate to profile page and change data', () => {
    login('dojefe6817@giratex.com','123456');
    
    cy.url().should('eq', 'http://localhost:4200/');

    // Click on the profile icon and then on the profile button
    cy.get('#p-icon')
      .click();
    cy.get('#p-btn')
      .click({ force: true });
    cy.url().should('eq', 'http://localhost:4200/user-profile');
    
    // Change the data
    cy.get('input[formControlName="FirstName"]')
      .clear()
      .type('Nicko');
    cy.get('input[formControlName="LastName"]')
      .clear()
      .type('Pipo');
    cy.get('input[formControlName="UserName"]')
      .clear()
      .type('Oli');
    cy.get('input[formControlName="PhoneNumber"]')
      .clear()
      .type('+18002332222');
    cy.get('input[formControlName="ProfilePicture"]')
      .selectFile('./cypress/e2e/TEST.png');
    cy.get('button[id="submit"]')
      .click();

    // Wait for the spinner to appear and then disappear
    cy.get('mat-progress-spinner', { timeout: 10000 }).should('exist');
    cy.get('mat-progress-spinner', { timeout: 120000 }).should('not.exist');
    cy.reload();

    // Check if the data has been updated
    // Also reset the data back to the original
    cy.get('input[formControlName="FirstName"]')
      .should('have.value', 'Nicko');
    

    cy.get('input[formControlName="LastName"]')
      .should('have.value', 'Pipo');
    

    cy.get('input[formControlName="UserName"]')
      .should('have.value', 'Oli');
    

    cy.get('input[formControlName="PhoneNumber"]')
      .should('have.value', '+18002332222');
    
    cy.get('img[alt="Avatar"]').invoke('attr', 'src').should('contain', 'TEST.png');

    cy.get('input[formControlName="FirstName"]')
      .clear()
      .type('Nick');

    cy.get('input[formControlName="LastName"]')
      .clear()
      .type('Pip');

    cy.get('input[formControlName="UserName"]')
      .clear()
      .type('Oli');

    cy.get('input[formControlName="PhoneNumber"]')
      .clear()
      .type('+15149391234');

    cy.get('input[formControlName="ProfilePicture"]')
      .selectFile('./cypress/e2e/default.png');

    cy.get('button[id="submit"]')
      .click();
  })
})
