import { login } from './utils.cy';

const checkBadge = (badgeHidden: boolean, value: string) => {
  if (badgeHidden) {
    cy.get('a.notifications button').should('not.have.attr', 'matBadgeHidden');
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
    // User logs in
    login('vemiji5713@bitofee.com', '123456');

    // Check if the notification button is visible
    cy.get('.navbar-nav a.notifications').should('be.visible');
    cy.get('.navbar-nav a.notifications').click({ force: true });

    // Check if the url is correct
    cy.url().should('eq', 'http://localhost:4200/notifications');
  });

  // Acceptance test for the notification badge
  // User logs in
  // User checks the notification bar
  // User checks the notification badge
  it('Check notification bar badge', () => {
    // User logs in
    login('vemiji5713@bitofee.com', '123456');

    // Check if the notification button is visible
    cy.get('.navbar-nav a.notifications').should('be.visible');

    // Check if the notification badge is visible and has the correct value
    cy.get('.navbar-nav a.notifications').should('be.visible');
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

    cy.get('.navbar-nav a.notifications').click({ force: true });

    cy.wait(2000);

    // Find the first notification and click on the "Mark as Read" button
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

    cy.get('.navbar-nav a.notifications').click({ force: true });

    cy.wait(2000);

    // Find the first notification and click on the "Mark as Unread" button
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

  // Acceptance test for sending a request to financial employee
  // User logs in
  // User navigates to my-properties page
  // User clicks on the property called "La Petite-Patrie"
  // User clicks on the "Requests" tab
  // User selects "Financial Request"
  // User fills in the form
  // User submits the form
  // User should see a success message
  it('Send financial request', () => {
    // User logs in
    login('guillaume2.lachapelle@gmail.com', '123456');

    // Navigate to the "My Properties" page
    cy.get('.mat-toolbar.mat-toolbar-single-row').within(() => {
      cy.wait(1000);
      cy.contains('My Properties').click();
      cy.wait(1000);
    });

    // Check url
    cy.url().should('include', 'http://localhost:4200/my-properties');

    /// Iterate through each building and find the one with the name "La Petite-Patrie"
    cy.get('.BuildingDiv').within(() => {
      cy.contains('.name', 'La Petite-Patrie')
        .parents('.card-content') // Navigate to the parent container of the building
        .within(() => {
          cy.get('#view_btn').click(); // Find and click the "View" button
        });
    });

    // Check url
    cy.url().should('include', 'http://localhost:4200/building-info');

    //Check overview tab
    cy.get('app-building-overview').should('be.visible');

    // Select the Condo tab and click on it
    cy.get('mat-tab-group')
      .should('be.visible')
      .within(() => {
        cy.contains('.mdc-tab__text-label', 'Requests').click();
      });

    // Verify if Requests tab content is visible
    cy.get('app-request-page').should('be.visible');

    // Find the mat-select element with formControlName "RequestType"
    cy.get('mat-select[formControlName="RequestType"]').then(($select) => {
      // Click on the mat-select element to open the dropdown
      cy.wrap($select).click();

      // Wait for the options to be visible
      cy.get('mat-option').should('be.visible');

      // Find the mat-option with the text "Financial Request" and click on it
      cy.contains('mat-option', 'FinancialRequest').click();
    });

    // Find the textarea element with id "comment-area"
    cy.get('textarea#comment-area')
      // Type the text "I need financial help" into the textarea
      .type('I need financial help');

    // Find the button element with type "submit"
    cy.get('button[type="submit"]')
      // Click on the button
      .click();

    // Check that the notification reads "Your request has been submitted"
    cy.contains(
      '.kawaiicolors-snackbar',
      'Your request has been submitted'
    ).should('be.visible');
  });

  // Acceptance test for employee receiving a request and updating status
  // User logs in
  // User navigates to the notification page
  // User looks for the notification
  // User clicks on Status mat-select
  // User selects "Denied"
  // User checks that the notification has been updated
  // User deletes the notification
  // User checks that the notification has been deleted
  it('Employee receives request and updates status', () => {
    login('sanic29650@gosarlar.com', '123456');

    cy.get('.navbar-nav a.notifications').click({ force: true });

    cy.wait(2000);

    // Find the notification with the text "I need financial help" and click on the status mat-select
    cy.get('.my-table').within(() => {
      cy.get('mat-row')
        .contains('I need financial help')
        .parent()
        .within(() => {
          cy.get('.mat-column-status').find('mat-select').click();
        });
    });

    // Set the status to "Denied"
    cy.get('mat-option').contains('Denied').click();

    // Check that the notification has been updated
    cy.get('.my-table').within(() => {
      cy.get('mat-row')
        .contains('I need financial help')
        .parent()
        .within(() => {
          // Look for the 'Delete' button within the 'actions-column mat-column-actions'
          cy.get('.actions-column.mat-column-actions')
            .find('button')
            .contains('delete') // Note: The text is 'delete', not 'Delete'
            .click({ force: true });
        });
    });

    // Exit the current context before interacting with the 'Confirm' button
    cy.contains('button', 'Confirm').click({ force: true });

    // Check that the notification has been deleted
    cy.get('.my-table').within(() => {
      cy.get('mat-row').contains('I need financial help').should('not.exist');
    });
  });

  // Acceptance test for change of status for public user
  // User logs in
  // User navigates to the notification page
  // User looks for the notification
  // User deletes the notification
  // User checks that the notification has been deleted
  it('Public user deletes notification', () => {
    login('guillaume2.lachapelle@gmail.com', '123456');

    cy.get('.navbar-nav a.notifications').click({ force: true });

    cy.wait(2000);

    // Find the notification with the text "Request status updated to "Denied" for request: I need financial help"
    cy.get('.my-table').within(() => {
      cy.get('mat-row')
        .contains(
          'Request status updated to "Denied" for request: I need financial help'
        )
        .parent()
        .within(() => {
          // Look for the 'Delete' button within the 'actions-column mat-column-actions'
          cy.get('.actions-column.mat-column-actions')
            .find('button')
            .contains('delete') // Note: The text is 'delete', not 'Delete'
            .click({ force: true });
        });
    });

    // Exit the current context before interacting with the 'Confirm' button
    cy.contains('button', 'Confirm').click({ force: true });

    // Check that the notification has been deleted
    cy.get('.my-table').within(() => {
      cy.get('mat-row')
        .contains(
          'Request status updated to "Denied" for request: I need financial help'
        )
        .should('not.exist');
    });
  });

  // Acceptance test for requesting a condo
  // User logs in
  // User clicks on building "La Petite-Patrie"
  // User clicks on the "Condos" tab
  // User clicks on the "Request" button for the first condo
  // Check that the notification reads "Your request for rental has been sent. You will be notified when it is approved."
  it('Request condo', () => {
    login('guillaume2.lachapelle@gmail.com', '123456');

    // Click on the "La Petite-Patrie" building
    cy.get('.BuildingDiv').within(() => {
      cy.contains('.name', 'La Petite-Patrie')
        .parents('.card-content') // Navigate to the parent container of the building
        .within(() => {
          cy.get('#view_btn').click(); // Find and click the "View" button
        });
    });

    // Check url
    cy.url().should('include', 'http://localhost:4200/building-info');

    // Select the Condo tab and click on it
    cy.get('mat-tab-group')
      .should('be.visible')
      .within(() => {
        cy.contains('.mdc-tab__text-label', 'Condos').click();
      });

    // Verify if Condos tab content is visible
    cy.get('app-condo').should('be.visible');

    // Find the first condo and click on the "Request for rent" button
    cy.get('.card')
      .first()
      .within(() => {
        cy.get('.buttonItem').contains('Request for rent').click();
      });

    // Check that the notification reads "Your request for rental has been sent. You will be notified when it is approved."
    cy.contains(
      '.kawaiicolors-snackbar',
      'Your request for rental has been sent. You will be notified when it is approved.'
    ).should('be.visible');
  });

  // Acceptance test for checking if condo request was received
  // User logs in
  // User navigates to the notification page
  // User looks for the notification
  // User checks that the notification has been updated
  // User deletes the notification
  it('Company approves condo request', () => {
    login('wasaf62813@evvgo.com', '123456');

    cy.get('.navbar-nav a.notifications').click({ force: true });

    cy.wait(2000);

    // Find the notification with the text "Request for rental has been sent. You will be notified when it is approved."
    cy.get('.my-table').within(() => {
      cy.get('mat-row')
        .first()
        .within(() => {
          // Check that the first notification message is similar to the desired type
          cy.get('.mat-column-message')
            .first()
            .invoke('text')
            .then((text) => {
              expect(
                text.includes('Request for rental of unit') &&
                  text.includes(' in La Petite-Patrie with ID')
              ).to.be.true;
            });
        });
    });

    // Delete the notification
    cy.get('.my-table').within(() => {
      cy.get('mat-row')
        .first()
        .parent()
        .within(() => {
          // Look for the 'Delete' button within the 'actions-column mat-column-actions'
          cy.get('.actions-column.mat-column-actions')
            .find('button')
            .contains('delete') // Note: The text is 'delete', not 'Delete'
            .click({ force: true });
        });
    });

    // Exit the current context before interacting with the 'Confirm' button
    cy.contains('button', 'Confirm').click({ force: true });

    cy.wait(1000);
  });

  // Acceptance test for requesting a locker
  // User logs in
  // User clicks on building "La Petite-Patrie"
  // User clicks on the "Lockers" tab
  // User clicks on the "Request" button for the first locker
  // Check that the notification reads "Your request for rental has been sent. You will be notified when it is approved."
  it('Request locker', () => {
    login('guillaume2.lachapelle@gmail.com', '123456');

    // Click on the "La Petite-Patrie" building
    cy.get('.BuildingDiv').within(() => {
      cy.contains('.name', 'La Petite-Patrie')
        .parents('.card-content') // Navigate to the parent container of the building
        .within(() => {
          cy.get('#view_btn').click(); // Find and click the "View" button
        });
    });

    // Check url
    cy.url().should('include', 'http://localhost:4200/building-info');

    // Select the Lockers tab and click on it
    cy.get('mat-tab-group')
      .should('be.visible')
      .within(() => {
        cy.contains('.mdc-tab__text-label', 'Lockers').click();
      });

    // Verify if Lockers tab content is visible
    cy.get('app-locker').should('be.visible');

    // Wait for the table to be available
    cy.get('table', { timeout: 10000 }).should('be.visible');

    // Find the first row and click the "Request for rent" button in the "Status" column
    cy.get('table.mat-elevation-z8')
      .find('tbody > tr')
      .first()
      .within(() => {
        // Check the content of the "Status" column
        cy.contains('td', 'Request for rent').should('be.visible');

        // Click on the "Request for rent" button
        cy.get('button.request').click();
      });

    // Check that the notification reads "Your request for rental has been sent. You will be notified when it is approved."
    cy.contains(
      '.kawaiicolors-snackbar',
      'Your request for rental has been sent. You will be notified when it is approved.'
    ).should('be.visible');
  });

  // Acceptance test for checking if locker request was received
  // User logs in
  // User navigates to the notification page
  // User looks for the notification
  // User checks that the notification has been updated
  // User deletes the notification
  it('Company verifies and deletes locker request', () => {
    login('wasaf62813@evvgo.com', '123456');

    cy.get('.navbar-nav a.notifications').click({ force: true });

    cy.wait(2000);

    // Find the notification with the text "Request for rental has been sent. You will be notified when it is approved."
    cy.get('.my-table').within(() => {
      cy.get('mat-row')
        .first()
        .within(() => {
          // Check that the first notification message is similar to the desired type
          cy.get('.mat-column-message')
            .first()
            .invoke('text')
            .then((text) => {
              expect(
                text.includes('Request for rental of locker') &&
                  text.includes(' in La Petite-Patrie with ID')
              ).to.be.true;
            });
        });
    });

    // Delete the notification
    cy.get('.my-table').within(() => {
      cy.get('mat-row')
        .first()
        .parent()
        .within(() => {
          // Look for the 'Delete' button within the 'actions-column mat-column-actions'
          cy.get('.actions-column.mat-column-actions')
            .find('button')
            .contains('delete') // Note: The text is 'delete', not 'Delete'
            .click({ force: true });
        });
    });

    // Exit the current context before interacting with the 'Confirm' button
    cy.contains('button', 'Confirm').click({ force: true });

    cy.wait(1000);
  });

  // Acceptance test for requesting a parking spot
  // User logs in
  // User clicks on building "La Petite-Patrie"
  // User clicks on the "Parking" tab
  // User clicks on the "Request" button for the first parking
  // Check that the notification reads "Your request for rental has been sent. You will be notified when it is approved."
  it('Request parking spot', () => {
    login('guillaume2.lachapelle@gmail.com', '123456');

    // Click on the "La Petite-Patrie" building
    cy.get('.BuildingDiv').within(() => {
      cy.contains('.name', 'La Petite-Patrie')
        .parents('.card-content') // Navigate to the parent container of the building
        .within(() => {
          cy.get('#view_btn').click(); // Find and click the "View" button
        });
    });

    // Check url
    cy.url().should('include', 'http://localhost:4200/building-info');

    // Select the Parking tab and click on it
    cy.get('mat-tab-group')
      .should('be.visible')
      .within(() => {
        cy.contains('.mdc-tab__text-label', 'Parking').click();
      });

    // Verify if Parking tab content is visible
    cy.get('app-parking-spot').should('be.visible');

    // Find the first row and click the "Request for rent" button in the "Status" column
    cy.get('table.mat-elevation-z8')
      .find('tbody > tr')
      .first()
      .within(() => {
        // Check the content of the "Status" column
        cy.contains('td', 'Request for rent').should('be.visible');

        // Click on the "Request for rent" button
        cy.get('button.request').click();
      });

    // Check that the notification reads "Your request for rental has been sent. You will be notified when it is approved."
    cy.contains(
      '.kawaiicolors-snackbar',
      'Your request for rental has been sent. You will be notified when it is approved.'
    ).should('be.visible');
  });

  // Acceptance test for checking if parking request was received
  // User logs in
  // User navigates to the notification page
  // User looks for the notification
  // User checks that the notification has been updated
  // User deletes the notification
  it('Company verifies and deletes parking spot request', () => {
    login('wasaf62813@evvgo.com', '123456');

    cy.get('.navbar-nav a.notifications').click({ force: true });

    cy.wait(2000);

    // Find the notification with the text "Request for rental has been sent. You will be notified when it is approved."
    cy.get('.my-table').within(() => {
      cy.get('mat-row')
        .first()
        .within(() => {
          // Check that the first notification message is similar to the desired type
          cy.get('.mat-column-message')
            .first()
            .invoke('text')
            .then((text) => {
              expect(
                text.includes('Request for rental of parking spot') &&
                  text.includes(' in La Petite-Patrie with ID')
              ).to.be.true;
            });
        });
    });

    // Delete the notification
    cy.get('.my-table').within(() => {
      cy.get('mat-row')
        .first()
        .parent()
        .within(() => {
          // Look for the 'Delete' button within the 'actions-column mat-column-actions'
          cy.get('.actions-column.mat-column-actions')
            .find('button')
            .contains('delete') // Note: The text is 'delete', not 'Delete'
            .click({ force: true });
        });
    });

    // Exit the current context before interacting with the 'Confirm' button
    cy.contains('button', 'Confirm').click({ force: true });

    cy.wait(1000);
  });
});
