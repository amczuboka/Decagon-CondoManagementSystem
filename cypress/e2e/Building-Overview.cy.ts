/**
 * Sign in as company user
 * User goes to their properties page
 * User publishes a new property with a description
 * Sing out as company user
 * Sign in as public user
 * Click on new property and go to building-info page
 */

import { CondoType, ParkingType } from 'src/app/models/properties';
import { CompanyDTO } from 'src/app/models/users';
import { addCondo, addLocker, addParking, login } from './utils.cy';

//Company logs in a creates new property
describe('Company logs in', () => {
  beforeEach(() => {
    login('karinasd007@gmail.com', 'company_pass');
    cy.url().should('eq', 'http://localhost:4200/');
  });

  it('Goes to my properties page', () => {
    cy.get('.mat-toolbar.mat-toolbar-single-row').within(() => {
      cy.wait(1000);
      cy.contains('My Properties').click();
      cy.wait(1000);
    });
  })

})