import { firebaseConfig } from 'src/environments/environment';
export const login = (email: string, password: string) => {
    cy.intercept('POST', 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + firebaseConfig.apiKey).as('apiCall')
    cy.visit('/login');
    cy.get('input[formControlName="Email"]')
        .type(email);
    cy.get('input[formControlName="Password"]')
        .type(password);
    cy.get('.pt-1')
        .find('.btn')
        .click({ force: true });
    cy.wait('@apiCall')
}