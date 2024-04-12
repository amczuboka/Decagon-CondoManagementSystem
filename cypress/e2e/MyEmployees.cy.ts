import { login } from './utils.cy';

describe('Test My Employees Page', () => {
  let employees = [] as any;

  before(() => {
    login('ravak45466@gexige.com', '123456');
    cy.window().then(async (win) => {
      employees = await (win as any).userService.getEmployeesOfCompany(
        'Guy Real Estate'
      );
      console.log(employees);
    });
  });

  after(() => {
    login('ravak45466@gexige.com', '123456');
    cy.window().then(async (win) => {
      employees.forEach(async (employee: any) => {
        await (win as any).userService.updateEmployee(employee);
      });
      //employees = await (win as any).userService.getEmployeesOfCompany('Guy Real Estate');
      //console.log(employees);
    });
  });

  it('Verify employee data', () => {
    login('ravak45466@gexige.com', '123456');
    cy.url().should('eq', 'http://localhost:4200/');
    // Change when a button to navigate to the My Employees page is added
    cy.visit('/my-employees');
    cy.url().should('eq', 'http://localhost:4200/my-employees');
    console.log(employees[0].FirstName);
    cy.wait(3000);
    cy.get('mat-select').should('exist');

    // Assert 3 Employees can be seen
    cy.get('table')
      .get('tbody')
      .find('tr')
      .should('have.length', employees.length);

    // Assert the employee names first
    cy.get('table')
      .get('tbody')
      .find('tr')
      .eq(0)
      .find('td')
      .eq(0)
      .should('contain', 'Tommy Smith');
    cy.get('table')
      .get('tbody')
      .find('tr')
      .eq(1)
      .find('td')
      .eq(0)
      .should('contain', 'Tommy Angelo');
    cy.get('table')
      .get('tbody')
      .find('tr')
      .eq(2)
      .find('td')
      .eq(0)
      .should('contain', 'Fernando Martinez');
    cy.get('table')
      .get('tbody')
      .find('tr')
      .eq(3)
      .find('td')
      .eq(0)
      .should('contain', 'Rick Ross');

    // Change the role of the first employee
    cy.get('table')
      .get('tbody')
      .find('tr')
      .eq(1)
      .find('td')
      .eq(3)
      .find('mat-select')
      .click();
    cy.get('mat-option').eq(3).click();

    // Change properties of the first employee
    cy.get('table')
      .get('tbody')
      .find('tr')
      .eq(1)
      .find('td')
      .eq(2)
      .find('mat-select')
      .click();
    cy.wait(1000);
    cy.get('mat-option').eq(1).click();
    cy.get('button').contains('Update').click({ force: true });
    cy.wait(1000);
    cy.reload();
    cy.wait(3000);
    // Assert the changes
    cy.get('table')
      .get('tbody')
      .find('tr')
      .eq(1)
      .find('td')
      .eq(3)
      .should('contain', 'Maintenance');
    cy.get('table')
      .get('tbody')
      .find('tr')
      .eq(1)
      .find('td')
      .eq(2)
      .should('contain', 'Espace Montmorency');
  });
});
