import {
  CreateProperty,
  DeleteProperty,
  login,
} from './utils.cy';

describe('Add New Property', () => {
  beforeEach(() => {
    login('rosef12997@hisotyr.com', '123456');
    cy.url().should('eq', 'http://localhost:4200/');
    cy.visit('/add-new-property');
  });

  it('should display the form with all required fields', () => {
    cy.get('form').should('exist');
    cy.get('input[name="Name"]').should('exist');
    cy.get('input[name="Country"]').should('exist');
    cy.get('input[name="State"]').should('exist');
    cy.get('input[name="City"]').should('exist');
    cy.get('input[name="StreetNN"]').should('exist');
    cy.get('input[name="ZipCode"]').should('exist');
    cy.get('input[name="Year"]').should('exist');
    cy.get('textarea[name="Description"]').should('exist');
    cy.get('input[name="Picture"]').should('exist');
    cy.get('mat-checkbox[value="Gym"]').should('exist');
    cy.get('mat-checkbox[value="Pool"]').should('exist');
    cy.get('mat-checkbox[value="Spa"]').should('exist');
    cy.get('mat-checkbox[value="Playground"]').should('exist');
    cy.get('mat-checkbox[value="Meeting Room"]').should('exist');
    cy.get('.add-component button').should('have.length', 3);
  });

  it('should display error messages for required fields', () => {
    cy.get('button[type="submit"]').click();
    cy.get('.alert-snackbar').should('be.visible');
  });

  it('should allow user to fill in the form and submit', async () => {
    CreateProperty();

    DeleteProperty();
  });
});
