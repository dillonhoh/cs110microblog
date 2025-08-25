// https://on.cypress.io/api

describe('My First Test', () => {
  it('visits the app root url', () => {
    cy.visit('/')
    cy.contains('h1', 'You did it!')
  })
})

describe('Microblog Basic Functionality', () => {
  it('shows the login form on the login page', () => {
    cy.visit('/login')
    cy.get('form').should('exist')
    cy.contains('button', /login|sign in/i)
  })

  it('navigates to the home/feed page', () => {
    cy.visit('/')
    cy.contains(/feed|home/i)
  })

  it('shows a post creation form or button', () => {
    cy.visit('/')
    cy.get('button,form').contains(/post|create/i)
  })

  it('displays at least one post in the feed (if any exist)', () => {
    cy.visit('/')
    cy.get('[class*=post], .post, [data-test=post]').should('exist')
  })
})
