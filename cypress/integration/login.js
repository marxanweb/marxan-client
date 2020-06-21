describe('My First Test', () => {
  it('Opens Marxan Web', () => {
    cy.visit('http://app.marxanweb.org');
    cy.get('[id="_selectServer"]').click();
    cy.get('div').contains('Beta test').click();
    cy.get('[id="username"]').type("wibble");
  })
})
