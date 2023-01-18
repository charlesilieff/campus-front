import { entityItemSelector } from '../../support/commands'
import {
  entityConfirmDeleteButtonSelector,
  entityCreateButtonSelector,
  entityCreateCancelButtonSelector,
  entityCreateSaveButtonSelector,
  entityDeleteButtonSelector,
  entityDetailsBackButtonSelector,
  entityDetailsButtonSelector,
  entityEditButtonSelector,
  entityTableSelector
} from '../../support/entity'

describe('Place e2e test', () => {
  const placePageUrl = '/place'
  const placePageUrlPattern = new RegExp('/place(\\?.*)?$')
  const username = Cypress.env('E2E_USERNAME') ?? 'admin'
  const password = Cypress.env('E2E_PASSWORD') ?? 'admin'

  before(() => {
    cy.window().then(win => {
      win.sessionStorage.clear()
    })
    cy.visit('')
    cy.login(username, password)
    cy.get(entityItemSelector).should('exist')
  })

  beforeEach(() => {
    cy.intercept('GET', '/api/places+(?*|)').as('entitiesRequest')
    cy.intercept('POST', '/api/places').as('postEntityRequest')
    cy.intercept('DELETE', '/api/places/*').as('deleteEntityRequest')
  })

  it('should load Places', () => {
    cy.visit('/')
    cy.clickOnEntityMenuItem('place')
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist')
      } else {
        cy.get(entityTableSelector).should('exist')
      }
    })
    cy.getEntityHeading('Place').should('exist')
    cy.url().should('match', placePageUrlPattern)
  })

  it('should load details Place page', function () {
    cy.visit(placePageUrl)
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        this.skip()
      }
    })
    cy.get(entityDetailsButtonSelector).first().click({ force: true })
    cy.getEntityDetailsHeading('place')
    cy.get(entityDetailsBackButtonSelector).click({ force: true })
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200)
    })
    cy.url().should('match', placePageUrlPattern)
  })

  it('should load create Place page', () => {
    cy.visit(placePageUrl)
    cy.wait('@entitiesRequest')
    cy.get(entityCreateButtonSelector).click({ force: true })
    cy.getEntityCreateUpdateHeading('Place')
    cy.get(entityCreateSaveButtonSelector).should('exist')
    cy.get(entityCreateCancelButtonSelector).click({ force: true })
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200)
    })
    cy.url().should('match', placePageUrlPattern)
  })

  it('should load edit Place page', function () {
    cy.visit(placePageUrl)
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        this.skip()
      }
    })
    cy.get(entityEditButtonSelector).first().click({ force: true })
    cy.getEntityCreateUpdateHeading('Place')
    cy.get(entityCreateSaveButtonSelector).should('exist')
    cy.get(entityCreateCancelButtonSelector).click({ force: true })
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200)
    })
    cy.url().should('match', placePageUrlPattern)
  })

  it('should create an instance of Place', () => {
    cy.visit(placePageUrl)
    cy.get(entityCreateButtonSelector).click({ force: true })
    cy.getEntityCreateUpdateHeading('Place')

    cy.get(`[data-cy="name"]`).type('Administrateur markets').should(
      'have.value',
      'Administrateur markets'
    )

    cy.get(`[data-cy="comment"]`).type('Fantastic payment Generic').should(
      'have.value',
      'Fantastic payment Generic'
    )

    cy.setFieldImageAsBytesOfEntity('image', 'integration-test.png', 'image/png')

    // since cypress clicks submit too fast before the blob fields are validated
    cy.wait(200) // eslint-disable-line cypress/no-unnecessary-waiting
    cy.get(entityCreateSaveButtonSelector).click({ force: true })
    cy.scrollTo('top', { ensureScrollable: false })
    cy.get(entityCreateSaveButtonSelector).should('not.exist')
    cy.wait('@postEntityRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(201)
    })
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200)
    })
    cy.url().should('match', placePageUrlPattern)
  })

  it('should delete last instance of Place', function () {
    cy.intercept('GET', '/api/places/*').as('dialogDeleteRequest')
    cy.visit(placePageUrl)
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length > 0) {
        cy.get(entityTableSelector).should('have.lengthOf', response.body.length)
        cy.get(entityDeleteButtonSelector).last().click({ force: true })
        cy.wait('@dialogDeleteRequest')
        cy.getEntityDeleteDialogHeading('place').should('exist')
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true })
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204)
        })
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200)
        })
        cy.url().should('match', placePageUrlPattern)
      } else {
        this.skip()
      }
    })
  })
})
