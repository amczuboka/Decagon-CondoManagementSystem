import { login } from './utils.cy';

describe('Key Registration Component', () => {
  beforeEach(() => {
    login('pail.farid99@gmail.com', 'Mosalah99');
    cy.visit('/key-registration');
    cy.wait(5000);
  });

  it('should display input fields and register button', () => {
    // Check if input fields and register button are visible
    cy.get('#registrationKey', {timeout: 10000}).should('exist');
    cy.get('.registrationType', { timeout: 10000 }).should('be.visible').click();
    cy.contains('button', 'Register').should('be.visible');
  });

  it('should register Condo key when input is filled and register button is clicked', () => {
    // Type a registration key
    const registrationKey = 'olxoxbbx02n1712215786582';
    cy.get('#registrationKey')
      .type(registrationKey)
      .should('have.value', registrationKey);

    // Wait for registration type dropdown to be visible and then select a registration type
    cy.get('.registrationType', { timeout: 10000 }).should('be.visible').click();
    cy.contains('.condo', 'Condo').click(); // Select the desired registration type

    // Click the register button
    cy.contains('button', 'Register').click();

    cy.on('window:alert', (str) => {
        expect(str).to.equal('Successfully registered!'); // Assert the alert message
      });
  });      

  it('should register Parking key when input is filled and register button is clicked', () => {
    // Type a registration key
    const registrationKey = 'zn9ii2r6z3p1712215786584';
    cy.get('#registrationKey')
      .type(registrationKey)
      .should('have.value', registrationKey);

    // Wait for registration type dropdown to be visible and then select a registration type
    cy.get('.registrationType', { timeout: 10000 }).should('be.visible').click();
    cy.contains('.parking', 'Parking').click(); // Select the desired registration type

    // Click the register button
    cy.contains('button', 'Register').click();

    cy.on('window:alert', (str) => {
        expect(str).to.equal('Successfully registered!'); // Assert the alert message
      });
  });

  it('should register Locker key when input is filled and register button is clicked', () => {
    // Type a registration key
    const registrationKey = 'gfcaeu208jw1712215786583';
    cy.get('#registrationKey')
      .type(registrationKey)
      .should('have.value', registrationKey);

    // Wait for registration type dropdown to be visible and then select a registration type
    cy.get('.registrationType', { timeout: 10000 }).should('be.visible').click();
    cy.contains('.locker', 'Locker').click(); // Select the desired registration type

    // Click the register button
    cy.contains('button', 'Register').click();

    cy.on('window:alert', (str) => {
        expect(str).to.equal('Successfully registered!'); // Assert the alert message
      });
  });

  it('should display an error message if input value is empty', () => {
    // Click the register button without entering a key
    cy.contains('button', 'Register').click();

    // Assert error message is shown
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Input value is empty!');
    });
  });

  it('should handle empty registration key input', () => {
    // Click the register button without entering a key
    cy.get('#registrationKey').clear();
    cy.contains('button', 'Register').click();

    // Assert error message is shown
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Input value is empty!');
    });
  });

  it('should handle special characters in registration key input', () => {
    // Type a registration key with special characters
    const registrationKey = '!@#$%^&*()';
    cy.get('.registrationType', { timeout: 10000 }).should('be.visible').click();
    cy.contains('button', 'Register').click({ force: true });

    // Assert error message is shown
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Invalid registration key!');
    });
  });

  it('should display an error message if registration key is invalid for condo registration', () => {
    // Type an invalid registration key
    const registrationKey = 'invalid-key';
    cy.get('#registrationKey').type(registrationKey);

    // Select condo registration type
    cy.get('.registrationType', { timeout: 10000 }).should('be.visible').click();
    cy.contains('.condo', 'Condo').click(); // Select the desired registration type

    // Click the register button
    cy.contains('button', 'Register').click();

    // Assert error message is shown
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Invalid registration key!');
    });
  });

  it('should display an error message if registration key is invalid for parking registration', () => {
    // Type an invalid registration key
    const registrationKey = 'invalid-key';
    cy.get('#registrationKey').type(registrationKey);

    // Select parking registration type
    cy.get('.registrationType', { timeout: 10000 }).should('be.visible').click();
    cy.contains('.parking', 'Parking').click(); // Select the desired registration type

    // Click the register button
    cy.contains('button', 'Register').click();

    // Assert error message is shown
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Invalid registration key!');
    });
  });

  it('should display an error message if registration key is invalid for locker registration', () => {
    // Type an invalid registration key
    const registrationKey = 'invalid-key';
    cy.get('#registrationKey').type(registrationKey);

    // Select locker registration type
    cy.get('.registrationType', { timeout: 10000 }).should('be.visible').click();
    cy.contains('.locker', 'Locker').click(); // Select the desired registration type

    // Click the register button
    cy.contains('button', 'Register').click();

    // Assert error message is shown
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Invalid registration key!');
    });
  });
});