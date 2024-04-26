import { login } from './utils.cy';

// The primary goal is to automate the acceptance testing of the navigation and functionality access to the Schedule tab, which is a crucial component for company users.
// This test ensures that the flow and functionalities of the Schedule feature are working correctly, allowing companies to effectively view and manage their weekly
// and monthly schedules.

//Step For company user:
// 1. User logs in
// 2. User navigates to My Properties
// 3. User clicks on their buildings
// 4. User Navigates to the Schedule Tab
// 5. User navigate their daily, weekly and monthly schedule
// 6. User navigate previous, today, and next day schedule

describe('Navigate to Schedule Tab as a Company User', () => {
  it('Should navigate and interact with the Schedule feature', () => {
    login('tcsn321@gmail.com', 'Tcsn321'); // Log in using predefined user credentials

    // Verify that the URL includes the expected path after login, ensuring the user is directed to the Home section
    cy.url().should('include', 'http://localhost:4200/');

    // Wait for 2 seconds to ensure the page and its components have fully loaded
    cy.wait(2000);

    // Click on the MyProperties button
    cy.get('.mat-toolbar.mat-toolbar-single-row').within(() => {
      cy.contains('My Properties').click();
    });
    // Ensure redirection to the My Properties page by verifying the URL
    cy.url().should('include', 'http://localhost:4200/my-properties');

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

    // Navigate to the "Schedule" tab
    cy.get('mat-tab-group')
      .should('be.visible')
      .within(() => {
        cy.contains('.mdc-tab__text-label', 'Schedule').click();
      });

    // Verify that the Schedule tab and its contents are visible
    cy.get('app-schedule').should('be.visible');

    // Interact with the calendar navigation buttons
    cy.get('#cal-date-nav-buttons').within(() => {
      cy.get('#previous').click();
      cy.get('#today').click();
      cy.get('#next').click();
    });

    // Verifying that the month view is loaded correctly
    cy.get('.cal-view-nav-buttons').within(() => {
      cy.get('#month').click();
    });

    // Check if the mwl-calendar-month-view element exists
    cy.get('mwl-calendar-month-view').should('exist').and('be.visible');

    // Verifying that the week view is loaded correctly
    cy.get('.cal-view-nav-buttons').within(() => {
      cy.get('#week').click();
    });

    // Check if the mwl-calendar-week-view element exists
    cy.get('mwl-calendar-week-view').should('exist').and('be.visible');

    // Verifying that the day view is loaded correctly
    cy.get('.cal-view-nav-buttons').within(() => {
      cy.get('#day').click();
    });

    // Check if the mwl-calendar-day-view element exists
    cy.get('mwl-calendar-day-view').should('exist').and('be.visible');
  });
});