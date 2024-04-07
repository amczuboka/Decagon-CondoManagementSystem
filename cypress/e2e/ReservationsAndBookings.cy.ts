import { login } from './utils.cy';

// Acceptance test for the viewing Reserving a facility and viewing the respective booking
// User logs in
// User navigates towards My Properties section
// User clicks on testing building
// User navigates to Reservations

describe('Test Booking a Reservation', () => {
  it('Navigate to MyProperties and check testing booking a reservation', () => {
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

    //Check overview tab
    cy.get('app-building-overview').should('be.visible');

    // Select the Reservations tab and click on it
    cy.get('mat-tab-group')
      .should('be.visible')
      .within(() => {
        cy.contains('.mdc-tab__text-label', 'Reservations').click();
      });
    // Verify if Reservations tab content is visible
    cy.get('app-bookings').should('be.visible');
    cy.get('.heading-content')
      .find('h2')
      .contains('Book Facility Time')
      .should('be.visible');

    // Find the Spa option and click on it
    cy.get('mat-radio-button').contains('Spa').click();

// Verify if the radio button has the correct CSS property
cy.get('mat-radio-button')
  .contains('Spa')
  .should(($el) => {
    // retry until the css property is applied
    const style = window.getComputedStyle($el[0]);
    const color = style.getPropertyValue('--mdc-radio-selected-focus-icon-color');
    expect(color).to.equal('#ff4081');
  });

    // Open up the calendar
    cy.get('.datepicker')
      .find('.mdc-icon-button')
      .find('.mat-mdc-button-touch-target').click();
    cy.get('mat-calendar').should('be.visible');

    // Select the date
    cy.get('mat-calendar')
      .find('.mat-calendar-body')
      .find('tr')
      .last()
      .find('td')
      .last()
      .find('.mat-calendar-body-cell')
      .click();

    // Select a time chip
    cy.get('mat-chip-listbox')
      .find('mat-chip-option')
      .first()
      .find('button')
      .click();

    // Chip should be selected
    cy.get('mat-chip-listbox')
      .find('mat-chip-option')
      .first()
      .should(($el) => {
        // retry until the css property is applied
        const style = window.getComputedStyle($el[0]);
        const color = style.getPropertyValue('--mdc-chip-elevated-container-color');
        expect(color).to.equal('#3f51b5');
    });

    // Find save button and click it
    cy.get('button').contains('Save').click();

    cy.wait(5000)

    // Verify if the booking card is visible
    cy.get('.heading-content')
      .contains('My Bookings')

    cy.get('app-booking-card').should('be.visible');

    cy.get('app-booking-card')
      .find('.card-header')
      .should('contain.text', 'Spa');
  });
});
