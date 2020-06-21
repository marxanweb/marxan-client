describe('My First Test', () => {
  it('Opens Marxan Web', () => {
    cy.visit('https://app.marxanweb.org');
    cy.get('[id="SelectMarxanServer"]').click();
    cy.get('div').contains('Beta test').click();
    cy.get('[id="TextUsername"]').type("admin");
    cy.get('[id="TextPassword"]').type("password");
    cy.get('span').contains('Login').click();
  })
})
