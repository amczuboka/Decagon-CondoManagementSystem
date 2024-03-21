import { CondoType, ParkingType } from 'src/app/models/properties';
import { CompanyDTO } from 'src/app/models/users';
import { addCondo, addLocker, addParking, login } from './utils.cy';

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
    cy.get('input[name="Name"]').type('Sample Building');
    cy.get('input[name="Country"]').type('Sample Country');
    cy.get('input[name="State"]').type('Sample State');
    cy.get('input[name="City"]').type('Sample City');
    cy.get('input[formControlName="StreetNN"]').type('Sample Street', {
      force: true,
    });
    cy.get('input[name="ZipCode"]').type('H6J 7K8');
    cy.get('input[name="Year"]').type('2022');
    cy.get('textarea[name="Description"]').type('Sample Description');
    cy.get('input[name="Picture"]').selectFile('./cypress/e2e/TEST.png');
    cy.get('mat-checkbox[value="Gym"]').click();
    cy.get('mat-checkbox[value="Pool"]').click();
    cy.get('mat-checkbox[value="Spa"]').click();
    cy.get('mat-checkbox[value="Playground"]').click();
    cy.get('mat-checkbox[value="Meeting Room"]').click();
    addCondo(CondoType.Rent);
    addCondo(CondoType.Sale);
    addLocker();
    addParking(ParkingType.Standard);
    addParking(ParkingType.Handicap);

    cy.get('button[type="submit"]').click();
    cy.wait(100);
    cy.get('.kawaiicolors-snackbar').should('exist');    // console.log('the user inside the functions');
    cy.window().then(async (win) => {
      const currentUser = (win as any).authService.getUser();
      const user = (await (win as any).userService.getCompanyUser(
        currentUser.uid
      )) as CompanyDTO;
      console.log('the user',user);
      for (const propertyId of user.PropertyIds) {
       await (win as any).buildingService.deleteBuilding(propertyId);
        console.log(propertyId);
      }
    });
  });
});
