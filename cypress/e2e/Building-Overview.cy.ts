/**
 * Company user logs in
 * Company user goes to 'My Properties'
 * Company user publishes a new property with a description
 * Sign in as public user
 * Public user clicks on new property
 * Public user navigates to building-overview tab
 * Company user logs in
 * Company user deleted newly created property
 */
import {
  CreateProperty,
  DeleteProperty,
  login,
} from './utils.cy';

//Company logs in, views 'My Properties' and creates new property
describe('Company user logs in', () => {
  beforeEach(() => {
    login('rosef12997@hisotyr.com', '123456');
    cy.url().should('eq', 'http://localhost:4200/');
  });

  it('Goes to my properties page', () => {
    cy.get('.mat-toolbar.mat-toolbar-single-row').within(() => {
      cy.wait(1000);
      cy.contains('My Properties').click();
      cy.wait(1000);
    });
  });

  it('Views newly created building', async() => {
    CreateProperty();

    cy.visit('/');
    cy.get('.BuildingDiv').within(() => {
      cy.contains('.name', 'Sample Building')
        .parents('.card-content')
        .within(() => {
          cy.get('#view_btn').click();
        });
    });
    cy.wait(2000);
    cy.get('#building-title-pic').scrollIntoView().should('be.visible');
    cy.get('#description').scrollIntoView().should('be.visible');
    cy.get('#general-info').scrollIntoView().should('be.visible');
    cy.get('#facilities').scrollIntoView().should('be.visible');
    cy.get('#company-info').scrollIntoView().should('be.visible');

    DeleteProperty();
  });
});