import { login } from './utils.cy';
describe('Budget Report Component', () => {
    beforeEach(() => {
        login('ravak45466@gexige.com', '123456');
        cy.url().should('eq', 'http://localhost:4200/');
        cy.visit('/budget-report');
      });
  
    it('should display the title correctly', () => {
      // Check if the title container exists and has the correct text
      cy.get('.title').should('be.visible').and('contain.text', 'Budget Report');
    });

  
    it('should display the table with data', () => {
      // Check if the table wrapper exists
      cy.get('.table-wrapper').should('be.visible');
  
      // Check if the table has at least one row
      cy.get('table').find('tr').should('have.length.gt', 1);
  
      // Check if the table headers are correct
      cy.get('table').find('th').should('have.length', 4);
      cy.get('table').find('th').eq(0).should('contain.text', 'Building');
      cy.get('table').find('th').eq(1).should('contain.text', 'Condo Fee Revenue');
      cy.get('table').find('th').eq(2).should('contain.text', 'Operation Costs');
      cy.get('table').find('th').eq(3).should('contain.text', 'Profit');
    });
  
    it('should display the total row with correct totals', () => {
      cy.get('.total-row').should('be.visible');
  
      // Check if the total row contains the correct total values
      cy.get('.total-condo-fee').should('contain.text', '$0.00'); 
      cy.get('.total-operation-cost').should('contain.text', '$92.00'); 
      cy.get('.total-profit').should('contain.text', '-$92.00');
    });
  });
  