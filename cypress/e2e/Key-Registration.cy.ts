import { login } from './utils.cy';

describe('Key Registration Component', () => {
  beforeEach(() => {
    login('pail.farid99@gmail.com', 'Mosalah99');
    cy.visit('/key-registration');
    cy.wait(5000);
  });

  it('should register Condo key when input is filled and register button is clicked', () => {
     cy.wait(5000);
    // Type a registration key
    const registrationKey = 'olxoxbbx02n1712215786582';
    cy.get('#registrationKey')
      .type(registrationKey)
      .should('have.value', registrationKey);

    // Wait for registration type dropdown to be visible and then select a registration type
    cy.get('.registrationType', { timeout: 10000 }).should('be.visible').click({ force: true });
    cy.contains('.condo', 'Condo').click({ force: true }); // Select the desired registration type

    // Click the register button
    cy.contains('button', 'Register').click({ force: true });

    cy.on('window:alert', (str) => {
        expect(str).to.equal('Successfully registered!'); // Assert the alert message
      });
  });      

  it('should register Parking key when input is filled and register button is clicked', () => {
     cy.wait(5000);
    // Type a registration key
    const registrationKey = 'zn9ii2r6z3p1712215786584';
    cy.get('#registrationKey')
      .type(registrationKey)
      .should('have.value', registrationKey);

    // Wait for registration type dropdown to be visible and then select a registration type
    cy.get('.registrationType', { timeout: 10000 }).should('be.visible').click({ force: true });
    cy.contains('.parking', 'Parking').click({ force: true }); // Select the desired registration type

    // Click the register button
    cy.contains('button', 'Register').click({ force: true });

    cy.on('window:alert', (str) => {
        expect(str).to.equal('Successfully registered!'); // Assert the alert message
      });
  });

  it('should register Locker key when input is filled and register button is clicked', () => {
     cy.wait(5000);
    // Type a registration key
    const registrationKey = 'gfcaeu208jw1712215786583';
    cy.get('#registrationKey')
      .type(registrationKey)
      .should('have.value', registrationKey);

    // Wait for registration type dropdown to be visible and then select a registration type
    cy.get('.registrationType', { timeout: 10000 }).should('be.visible').click({ force: true });
    cy.contains('.locker', 'Locker').click({ force: true }); // Select the desired registration type

    // Click the register button
    cy.contains('button', 'Register').click({ force: true });

    cy.on('window:alert', (str) => {
        expect(str).to.equal('Successfully registered!'); // Assert the alert message
      });
  });

  it('should display an error message if input value is empty', () => {
     cy.wait(5000);
    // Click the register button without entering a key
    cy.contains('button', 'Register').click({ force: true });

    // Assert error message is shown
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Input value is empty!');
    });
  });

  it('should handle empty registration key input', () => {
     cy.wait(5000);
    // Click the register button without entering a key
    cy.get('#registrationKey').clear();
    cy.contains('button', 'Register').click({ force: true });

    // Assert error message is shown
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Input value is empty!');
    });
  });

  it('should handle special characters in registration key input', () => {
    // Type a registration key with special characters
     cy.wait(5000);
    const registrationKey = '!@#$%^&*()';
    cy.get('.registrationType', { timeout: 10000 }).should('be.visible').click({ force: true });
    cy.contains('button', 'Register').click({ force: true });

    // Assert error message is shown
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Invalid registration key!');
    });
  });

  it('should display an error message if registration key is invalid for condo registration', () => {
     cy.wait(5000);
    // Type an invalid registration key
    const registrationKey = 'invalid-key';
    cy.get('#registrationKey').type(registrationKey);

    // Select condo registration type
    cy.get('.registrationType', { timeout: 10000 }).should('be.visible').click({ force: true });
    cy.contains('.condo', 'Condo').click({ force: true }); // Select the desired registration type

    // Click the register button
    cy.contains('button', 'Register').click({ force: true });

    // Assert error message is shown
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Invalid registration key!');
    });
  });

  it('should display an error message if registration key is invalid for parking registration', () => {
     cy.wait(5000);
    // Type an invalid registration key
    const registrationKey = 'invalid-key';
    cy.get('#registrationKey').type(registrationKey);

    // Select parking registration type
    cy.get('.registrationType', { timeout: 10000 }).should('be.visible').click({ force: true });
    cy.contains('.parking', 'Parking').click({ force: true }); // Select the desired registration type

    // Click the register button
    cy.contains('button', 'Register').click({ force: true });

    // Assert error message is shown
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Invalid registration key!');
    });
  });

  it('should display an error message if registration key is invalid for locker registration', () => {
     cy.wait(5000);
    // Type an invalid registration key
    const registrationKey = 'invalid-key';
    cy.get('#registrationKey').type(registrationKey);

    // Select locker registration type
    cy.get('.registrationType', { timeout: 10000 }).should('be.visible').click({ force: true });
    cy.contains('.locker', 'Locker').click({ force: true }); // Select the desired registration type

    // Click the register button
    cy.contains('button', 'Register').click({ force: true });

    // Assert error message is shown
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Invalid registration key!');
    });
  });
});