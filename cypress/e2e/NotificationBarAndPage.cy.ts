import { login } from './utils.cy';

const checkBadge = (badgeHidden: boolean, value: string) => {
  if (badgeHidden) {
    cy.get('a.notifications button').should(
      'not.have.attr',
      'matBadgeHidden'
    );
  }
  cy.get('a.notifications button mat-icon')
    .invoke('attr', 'data-badge')
    .should('equal', value);
};

describe('Test Notifications', () => {
  // Acceptance test for the notification bar
  // User logs in
  // User checks the notification bar
  // User clicks on the notification bar
  // User checks that they've been redirected to the notification page
  it('Check notification button', () => {
    login('vemiji5713@bitofee.com', '123456');

    cy.get('a.notifications').should('be.visible');
    cy.get('a.notifications').click({ force: true });

    cy.url().should('eq', 'http://localhost:4200/notifications');
  });

  // Acceptance test for the notification badge
  // User logs in
  // User checks the notification bar
  // User checks the notification badge
  it('Check notification bar badge', () => {
    login('vemiji5713@bitofee.com', '123456');

    cy.get('a.notifications').should('be.visible');

    cy.get('a.notifications').should('be.visible');
    checkBadge(true, '1');
  });

  // Acceptance test for marking a notification as read
  // User logs in
  // User checks the notification bar
  // User clicks on the notification bar
  // User checks that they've been redirected to the notification page
  // User marks a notification as read
  // User checks that the notification badge has been updated
  it('Check mark as read', () => {
    login('vemiji5713@bitofee.com', '123456');

    cy.get('a.notifications').click({ force: true });

    cy.wait(2000);

    cy.get('.my-table').within(() => {
      cy.get('mat-row')
        .contains('First Notification')
        .parent()
        .within(() => {
          cy.get('button').contains('Mark as Read').click();
        });
    });

    checkBadge(false, '0');
  });

  // Acceptance test for marking a notification as unread
  // User logs in
  // User checks the notification bar
  // User clicks on the notification bar
  // User checks that they've been redirected to the notification page
  // User marks a notification as unread
  // User checks that the notification badge has been updated
  it('Check mark as unread', () => {
    login('vemiji5713@bitofee.com', '123456');

    cy.get('a.notifications').click({ force: true });

    cy.wait(2000);

    cy.get('.my-table').within(() => {
      cy.get('mat-row')
        .contains('First Notification')
        .parent()
        .within(() => {
          cy.get('button').contains('Mark as Unread').click();
        });
    });

    checkBadge(true, '1');
  });
});
