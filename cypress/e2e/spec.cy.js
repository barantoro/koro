beforeEach(() => {
  cy.visit('http://localhost:5173')
})


it('Checks search', () => {
  cy.wait(2000)
  cy.get('.search-bar').type("ea molestias quasi exercitationem repellat qui ipsa sit aut")
  cy.wait(2000)
  cy.get('.search-bar').clear()
  cy.wait(2000)
  cy.get(`[aria-label="Select all posts checkbox"]`).click()
  cy.wait(2000)
  cy.get(`[aria-label="Select all posts checkbox"]`).click()
  cy.wait(2000)
  cy.get('.search-bar').type("consectetur animi nesciunt iure dolore")
  cy.wait(2000)
  cy.get('.search-bar').clear()
})



it('Creates new post', () => {
  cy.wait(2000)
  cy.get(`[aria-label="Create new post button"]`).click()
  cy.wait(2000)
  cy.get('.input').type("I couldn't type to ckeditor :(")
  cy.wait(2000)
  cy.get('.select').select('1')
  cy.wait(2000)
  cy.get(`[aria-label="Create new post"]`).click()
  cy.wait(2000)
})



it('Updates existing post', () => {
  cy.wait(2000)
  cy.get('tr').eq(-2).find('button').click();
  cy.wait(2000)
  cy.get(`[aria-label="Edit post link"]`).click({force: true})
  cy.wait(2000)
  cy.get('.input').clear()
  cy.wait(2000)
  cy.get('.input').type("check validation")
  cy.wait(2000)
  cy.get('.input').clear()
  cy.wait(2000)
  cy.get(`[aria-label="Save changes"]`).click()
  cy.wait(2000)
  cy.get('.input').type("lorem ipsum dolor")
  cy.wait(2000)
  cy.get('.select').select('1')
  cy.wait(2000)
  cy.get(`[aria-label="Save changes"]`).click()
  cy.wait(2000)
})



it('Deletes existing post', () => {
  cy.wait(2000)
  cy.get('tr').eq(-2).find('button').click();
  cy.wait(2000)
  cy.get(`[aria-label="Delete post link"]`).click({force: true})
  cy.wait(2000)
  cy.get('.swal2-confirm').click()
  cy.wait(2000)
  cy.get('.swal2-confirm').click()
  cy.wait(2000)
})


it('Checks accessibility', () => {
  cy.wait(2000)
  cy.get('[aria-label]')
  cy.wait(2000)
  cy.get('tr').eq(-2).find('button').click();
  cy.wait(2000)
  cy.get(`[aria-label="Edit post link"]`).click({force: true})
  cy.wait(2000)
  cy.get('[aria-labelledby]')
  cy.get('[aria-label]')
  cy.wait(2000)
  cy.get(`[aria-label="Close modal"]`).click()
  cy.wait(2000)
})


 


