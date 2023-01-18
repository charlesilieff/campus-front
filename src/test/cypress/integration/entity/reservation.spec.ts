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

describe('Reservation e2e test', () => {
  const reservationPageUrl = '/reservation'
  const reservationPageUrlPattern = new RegExp('/reservation(\\?.*)?$')
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
    cy.intercept('GET', '/api/reservations+(?*|)').as('entitiesRequest')
    cy.intercept('POST', '/api/reservations').as('postEntityRequest')
    cy.intercept('DELETE', '/api/reservations/*').as('deleteEntityRequest')
  })

  // it('should load Reservations', () => {
  //   cy.visit('/');
  //   cy.clickOnEntityMenuItem('reservation');
  //   cy.wait('@entitiesRequest').then(({ response }) => {
  //     if (response.body.length === 0) {
  //       cy.get(entityTableSelector).should('not.exist');
  //     } else {
  //       cy.get(entityTableSelector).should('exist');
  //     }
  //   });
  //   cy.getEntityHeading('Reservation').should('exist');
  //   cy.url().should('match', reservationPageUrlPattern);
  // });

  it('should load details Reservation page', function () {
    cy.visit(reservationPageUrl)
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        this.skip()
      }
    })
    cy.get(entityDetailsButtonSelector).first().click({ force: true })
    cy.getEntityDetailsHeading('reservation')
    cy.get(entityDetailsBackButtonSelector).click({ force: true })
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200)
    })
    cy.url().should('match', reservationPageUrlPattern)
  })

  it('should load create Reservation page', () => {
    cy.visit(reservationPageUrl)
    cy.wait('@entitiesRequest')
    cy.get(entityCreateButtonSelector).click({ force: true })
    cy.getEntityCreateUpdateHeading('Reservation')
    cy.get(entityCreateSaveButtonSelector).should('exist')
    cy.get(entityCreateCancelButtonSelector).click({ force: true })
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200)
    })
    cy.url().should('match', reservationPageUrlPattern)
  })

  it('should load edit Reservation page', function () {
    cy.visit(reservationPageUrl)
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        this.skip()
      }
    })
    cy.get(entityEditButtonSelector).first().click({ force: true })
    cy.getEntityCreateUpdateHeading('Reservation')
    cy.get(entityCreateSaveButtonSelector).should('exist')
    cy.get(entityCreateCancelButtonSelector).click({ force: true })
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200)
    })
    cy.url().should('match', reservationPageUrlPattern)
  })

  it('should create an instance of Reservation', () => {
    cy.visit(reservationPageUrl)
    cy.get(entityCreateButtonSelector).click({ force: true })
    cy.getEntityCreateUpdateHeading('Reservation')

    cy.get(`[data-cy="personNumber"]`).type('131').should('have.value', '131')

    cy.get(`[data-cy="paymentMode"]`).type('infomediaries').should('have.value', 'infomediaries')

    cy.get(`[data-cy="isPaid"]`).should('not.be.checked')
    cy.get(`[data-cy="isPaid"]`).click().should('be.checked')

    cy.get(`[data-cy="isConfirmed"]`).should('not.be.checked')
    cy.get(`[data-cy="isConfirmed"]`).click().should('be.checked')

    cy.get(`[data-cy="specialDietNumber"]`).type('144').should('have.value', '144')

    cy.get(`[data-cy="isLunchOnly"]`).should('not.be.checked')

    cy.get(`[data-cy="isArrivalDiner"]`).should('not.be.checked')
    cy.get(`[data-cy="isArrivalDiner"]`).click().should('be.checked')

    cy.get(`[data-cy="isDepartureDiner"]`).should('not.be.checked')
    cy.get(`[data-cy="isDepartureDiner"]`).click().should('be.checked')

    cy.get(`[data-cy="isArrivalLunch"]`).should('not.be.checked')
    cy.get(`[data-cy="isArrivalLunch"]`).click().should('be.checked')

    cy.get(`[data-cy="isDepartureLunch"]`).should('not.be.checked')
    cy.get(`[data-cy="isDepartureLunch"]`).click().should('be.checked')

    cy.get(`[data-cy="arrivalDate"]`).type('2221-08-23').should('have.value', '2221-08-23')

    cy.get(`[data-cy="departureDate"]`).type('2221-08-31').should('have.value', '2221-08-31')

    cy.get(`[data-cy="comment"]`).type('Baby pink').should('have.value', 'Baby pink')

    cy.setFieldSelectToLastOfEntity('pricing')

    cy.setFieldSelectToLastOfEntity('bed')

    cy.setFieldSelectToLastOfEntity('customer')

    cy.get(entityCreateSaveButtonSelector).click({ force: true })
    cy.scrollTo('top', { ensureScrollable: false })
    cy.get(entityCreateSaveButtonSelector).should('not.exist')
    cy.wait('@postEntityRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(201)
    })
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200)
    })
    cy.url().should('match', reservationPageUrlPattern)
  })

  it('should delete last instance of Reservation', function () {
    cy.intercept('GET', '/api/reservations/*').as('dialogDeleteRequest')
    cy.visit(reservationPageUrl)
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length > 0) {
        cy.get(entityTableSelector).should('have.lengthOf', response.body.length)
        cy.get(entityDeleteButtonSelector).last().click({ force: true })
        cy.wait('@dialogDeleteRequest')
        cy.getEntityDeleteDialogHeading('reservation').should('exist')
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true })
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204)
        })
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200)
        })
        cy.url().should('match', reservationPageUrlPattern)
      } else {
        this.skip()
      }
    })
  })
})
