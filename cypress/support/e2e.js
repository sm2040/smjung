// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
require('cypress-xpath')

// Alternatively you can use CommonJS syntax:
// require('./commands')



// Cypress.on('uncaught:exception', (err, runnable) => {
//     // returning false here prevents Cypress from
//     // failing the test
//     return false
// })

afterEach(() => {
    Cypress.Cookies.preserveOnce('connect.sid')
})

// // fixture 파일내 변수 사용
before(function () {
    cy.fixture('user').then(function (user) {
        this.user = user
        cy.visitPage('/')
        cy.closeModal()
        cy.login(this.user.id, this.user.pwd)

    })

})

beforeEach(function() {
    cy.closeModal()
})

// afterEach(function() {
//     cy.closeModal()
// })

// after(function() {
//     cy.goHome();
//     cy.closeModal();
//     cy.removeAllAddress();
//     cy.closeModal();
//     cy.removeCartItems();
// })